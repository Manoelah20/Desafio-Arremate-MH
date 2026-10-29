const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');
const { amountToCents, centsToAmount } = require('../utils/bid');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
  }

  if (role && role !== 'licitante') {
    return res.status(403).json({ error: 'O cadastro público está disponível apenas para licitantes.' });
  }

  const validRole = 'licitante';

  try {
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const initialBalance = validRole === 'licitante' ? 1000.00 : 0;

    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password, role, balance)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, balance`,
      [name, email, hash, validRole, initialBalance]
    );

    const user = rows[0];
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ token, user });
  } catch (err) {
    console.error('[auth/register]', err.message);
    res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, password, role, balance FROM users WHERE email = $1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error('[auth/login]', err.message);
    res.status(500).json({ error: 'Erro ao autenticar.' });
  }
});

// GET /api/auth/me
const { authMiddleware } = require('../middleware/auth');
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, role, balance, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });

    // Calcular saldo comprometido (lance ativo em lotes ao vivo)
    const { rows: committed } = await pool.query(
      `SELECT COALESCE(SUM(l.current_bid), 0) AS committed
       FROM lots l
       WHERE l.status = 'ao_vivo'
         AND l.winner_id = $1`,
      [req.user.id]
    );

    const user = rows[0];
    const committedCents = amountToCents(committed[0].committed);
    const balanceCents = amountToCents(user.balance);
    user.committed_balance = Number(centsToAmount(committedCents));
    user.available_balance = Number(centsToAmount(balanceCents - committedCents));

    res.json({ user });
  } catch (err) {
    console.error('[auth/me]', err.message);
    res.status(500).json({ error: 'Erro ao buscar dados do usuário.' });
  }
});

// POST /api/auth/deposit — depósito simulado
router.post('/deposit', authMiddleware, async (req, res) => {
  const { amount } = req.body;
  let depositCents;
  try {
    depositCents = amountToCents(amount);
  } catch {
    return res.status(400).json({ error: 'Valor inválido para depósito.' });
  }
  if (depositCents <= 0n) {
    return res.status(400).json({ error: 'Valor inválido para depósito.' });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE users SET balance = balance + $1 WHERE id = $2
       RETURNING id, name, email, role, balance`,
      [centsToAmount(depositCents), req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.json({ user: rows[0], message: `Depósito de R$ ${centsToAmount(depositCents)} realizado com sucesso.` });
  } catch (err) {
    console.error('[auth/deposit]', err.message);
    res.status(500).json({ error: 'Erro ao realizar depósito.' });
  }
});

module.exports = router;
