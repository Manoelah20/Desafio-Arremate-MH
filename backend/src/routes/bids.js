const express = require('express');
const crypto = require('crypto');
const pool = require('../db/pool');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { amountToCents, centsToAmount, createBidHash, canonicalTimestamp } = require('../utils/bid');

const router = express.Router();

// ─── POST /api/bids — dar lance (licitante)
router.post('/', authMiddleware, requireRole('licitante'), async (req, res) => {
  const { lot_id, amount } = req.body;
  if (!lot_id || amount === undefined || amount === null) {
    return res.status(400).json({ error: 'lot_id e amount são obrigatórios.' });
  }

  let amountCents;
  try {
    amountCents = amountToCents(amount);
  } catch {
    return res.status(400).json({ error: 'Valor do lance inválido.' });
  }
  if (amountCents <= 0n) {
    return res.status(400).json({ error: 'Valor do lance inválido.' });
  }

  let client;
  let inTransaction = false;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    inTransaction = true;

    // Bloquear o lote para leitura durante a transação (evitar race condition)
    const { rows: lots } = await client.query(
      'SELECT * FROM lots WHERE id = $1 FOR UPDATE',
      [lot_id]
    );

    if (lots.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Lote não encontrado.' });
    }

    const lot = lots[0];
    const now = new Date();

    // ── Validações de regra de negócio
    if (lot.status !== 'ao_vivo') {
      await client.query('ROLLBACK');
      const reason = lot.status === 'agendado' ? 'Lote ainda não iniciado.' :
        lot.status === 'encerrado' ? 'Lote já encerrado.' :
          'Lote cancelado.';
      return res.status(400).json({ error: reason });
    }

    if (new Date(lot.ends_at) <= now) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Lote encerrado.' });
    }

    if (new Date(lot.starts_at) > now) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Lote ainda não iniciado.' });
    }

    // Líder não pode cobrir o próprio lance
    if (lot.winner_id === req.user.id) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Você já está ganhando este lote!' });
    }

    // Valor mínimo: primeiro lance = initial_bid, demais = current_bid + increment
    const hasAnyBid = amountToCents(lot.current_bid) > 0n && lot.winner_id;
    const minimumRequiredCents = hasAnyBid
      ? amountToCents(lot.current_bid) + amountToCents(lot.min_increment)
      : amountToCents(lot.initial_bid);

    if (amountCents < minimumRequiredCents) {
      const minimumRequired = centsToAmount(minimumRequiredCents);
      await client.query('ROLLBACK');
      inTransaction = false;
      return res.status(400).json({
        error: `Lance abaixo do mínimo. Valor mínimo: R$ ${minimumRequired}.`,
        minimum: Number(minimumRequired),
      });
    }

    // Verificar saldo disponível do licitante
    const { rows: users } = await client.query(
      'SELECT balance FROM users WHERE id = $1 FOR UPDATE',
      [req.user.id]
    );
    if (users.length === 0) {
      await client.query('ROLLBACK');
      inTransaction = false;
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }
    const user = users[0];

    // Calcular saldo comprometido em outros lotes
    const { rows: committed } = await client.query(
      `SELECT COALESCE(SUM(l.current_bid), 0) AS committed
       FROM lots l
       WHERE l.winner_id = $1 AND l.status = 'ao_vivo' AND l.id != $2`,
      [req.user.id, lot_id]
    );

    const totalCommittedCents = amountToCents(committed[0].committed);
    const availableBalanceCents = amountToCents(user.balance) - totalCommittedCents;

    if (amountCents > availableBalanceCents) {
      const availableBalance = centsToAmount(availableBalanceCents);
      await client.query('ROLLBACK');
      inTransaction = false;
      return res.status(400).json({
        error: `Saldo insuficiente. Disponível: R$ ${availableBalance}.`,
        available: Number(availableBalance),
      });
    }

    // ── Buscar último lance para encadeamento do hash (anti-adulteração)
    const { rows: lastBid } = await client.query(
      `SELECT chain_hash, created_at FROM bids WHERE lot_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [lot_id]
    );
    const prevHash = lastBid.length > 0
      ? lastBid[0].chain_hash
      : '0000000000000000000000000000000000000000000000000000000000000000';

    // ── Inserir lance
    const bidId = crypto.randomUUID();
    const lastTimestamp = lastBid.length > 0 ? new Date(lastBid[0].created_at).getTime() : 0;
    const createdAt = canonicalTimestamp(new Date(Math.max(Date.now(), lastTimestamp + 1)));
    const canonicalAmount = centsToAmount(amountCents);
    const chainHash = createBidHash(prevHash, bidId, lot_id, req.user.id, canonicalAmount, createdAt);

    await client.query(
      `INSERT INTO bids (id, lot_id, bidder_id, amount, chain_hash, prev_hash, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [bidId, lot_id, req.user.id, canonicalAmount, chainHash, prevHash, createdAt]
    );

    // ── Verificar anti-sniping: se lance nos últimos 2 min, prorrogar +2 min
    const endsAt = new Date(lot.ends_at);
    const twoMinutesBeforeEnd = new Date(endsAt.getTime() - 2 * 60 * 1000);
    let newEndsAt = endsAt;

    if (now >= twoMinutesBeforeEnd) {
      newEndsAt = new Date(endsAt.getTime() + 2 * 60 * 1000);
      await client.query(
        `UPDATE lots SET ends_at = $1 WHERE id = $2`,
        [newEndsAt.toISOString(), lot_id]
      );
      await client.query(
        `INSERT INTO audit_log (lot_id, event_type, payload) VALUES ($1, 'lot_extended', $2)`,
        [lot_id, JSON.stringify({ extended_to: newEndsAt.toISOString(), reason: 'anti_sniping' })]
      );
    }

    // ── Atualizar lance atual do lote e vencedor
    await client.query(
      `UPDATE lots SET current_bid = $1, winner_id = $2 WHERE id = $3`,
      [canonicalAmount, req.user.id, lot_id]
    );

    // ── Audit log
    await client.query(
      `INSERT INTO audit_log (lot_id, event_type, payload) VALUES ($1, 'bid', $2)`,
      [lot_id, JSON.stringify({ bid_id: bidId, bidder_id: req.user.id, amount: canonicalAmount, chain_hash: chainHash })]
    );

    await client.query('COMMIT');
    inTransaction = false;

    const bid = {
      id: bidId,
      lot_id,
      bidder_id: req.user.id,
      bidder_name: req.user.name,
      amount: Number(canonicalAmount),
      chain_hash: chainHash,
      prev_hash: prevHash,
      created_at: createdAt,
    };

    // O evento contém apenas dados públicos; falhas de realtime não desfazem o lance confirmado.
    const publishLotEvent = req.app.get('publishLotEvent');
    if (publishLotEvent) {
      try {
        await publishLotEvent(`lot:${lot_id}`, 'new_bid', {
          lot_id,
        });
      } catch (err) {
        console.error('[realtime/new_bid]', err.message);
      }
    }

    res.status(201).json({ bid, lot_ends_at: newEndsAt.toISOString() });
  } catch (err) {
    if (client && inTransaction) {
      await client.query('ROLLBACK');
    }
    console.error('[bids/place]', err.message);
    res.status(500).json({ error: 'Erro ao registrar lance.' });
  } finally {
    if (client) client.release();
  }
});

// ─── GET /api/bids/my — histórico de lances do licitante logado
router.get('/my', authMiddleware, requireRole('licitante'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT b.id, b.amount, b.created_at, b.chain_hash,
              l.id AS lot_id, l.title, l.status, l.current_bid,
              l.image_url, l.ends_at,
              CASE WHEN l.winner_id = $1 THEN true ELSE false END AS is_winning
       FROM bids b
       JOIN lots l ON l.id = b.lot_id
       WHERE b.bidder_id = $1
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );
    res.json({ bids: rows });
  } catch (err) {
    console.error('[bids/my]', err.message);
    res.status(500).json({ error: 'Erro ao buscar seus lances.' });
  }
});

// ─── GET /api/bids/wins — lotes vencidos (comprovantes)
router.get('/wins', authMiddleware, requireRole('licitante'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT l.id, l.title, l.image_url, l.current_bid AS winning_bid,
              l.ends_at, l.external_data,
              u.name AS auctioneer_name
       FROM lots l
       JOIN users u ON u.id = l.auctioneer_id
       WHERE l.winner_id = $1 AND l.status = 'encerrado'
       ORDER BY l.ends_at DESC`,
      [req.user.id]
    );
    res.json({ wins: rows });
  } catch (err) {
    console.error('[bids/wins]', err.message);
    res.status(500).json({ error: 'Erro ao buscar arremates.' });
  }
});

module.exports = router;
