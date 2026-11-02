const express = require('express');
const axios = require('axios');
const pool = require('../db/pool');
const { authMiddleware, requireRole } = require('../middleware/auth');
const { amountToCents, centsToAmount } = require('../utils/bid');
const { toPublicDemoLot } = require('../utils/demoLot');

const router = express.Router();

// ─── GET /api/lots — listar lotes (vitrine pública, sem login)
router.get('/', async (req, res) => {
  const { status, search } = req.query;
  try {
    let query = `
      SELECT l.id, l.title, l.description, l.image_url, l.external_data,
             l.initial_bid, l.min_increment, l.current_bid, l.status,
             l.starts_at, l.ends_at, l.created_at,
             (SELECT COUNT(*)::int FROM bids b WHERE b.lot_id = l.id) AS total_bids,
             u.name AS auctioneer_name,
             CASE WHEN wu.id IS NULL THEN NULL
               WHEN char_length(wu.name) <= 2
                 THEN LEFT(wu.name, 1) || REPEAT('*', GREATEST(char_length(wu.name) - 1, 1))
               ELSE LEFT(wu.name, 1) || REPEAT('*', char_length(wu.name) - 2) || RIGHT(wu.name, 1)
             END AS winner_name
      FROM lots l
      JOIN users u ON u.id = l.auctioneer_id
      LEFT JOIN users wu ON wu.id = l.winner_id
      WHERE l.status != 'cancelado'
    `;
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND l.status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (l.title ILIKE $${params.length} OR l.description ILIKE $${params.length})`;
    }

    query += ' ORDER BY l.ends_at ASC';
    const { rows } = await pool.query(query, params);
    res.json({ lots: rows.map(toPublicDemoLot) });
  } catch (err) {
    console.error('[lots/list]', err.message);
    res.status(500).json({ error: 'Erro ao buscar lotes.' });
  }
});

// ─── GET /api/lots/:id — detalhes de um lote (público)
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT l.id, l.title, l.description, l.image_url, l.external_data,
              l.initial_bid, l.min_increment, l.current_bid, l.status,
              l.starts_at, l.ends_at, l.created_at,
              (SELECT COUNT(*)::int FROM bids b WHERE b.lot_id = l.id) AS total_bids,
              u.name AS auctioneer_name,
              CASE WHEN wu.id IS NULL THEN NULL
                WHEN char_length(wu.name) <= 2
                  THEN LEFT(wu.name, 1) || REPEAT('*', GREATEST(char_length(wu.name) - 1, 1))
                ELSE LEFT(wu.name, 1) || REPEAT('*', char_length(wu.name) - 2) || RIGHT(wu.name, 1)
              END AS winner_name
       FROM lots l
       JOIN users u ON u.id = l.auctioneer_id
       LEFT JOIN users wu ON wu.id = l.winner_id
       WHERE l.id = $1`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Lote não encontrado.' });

    const { rows: bids } = await pool.query(
      `SELECT b.id, b.amount, b.chain_hash, b.prev_hash, b.created_at,
              CASE WHEN char_length(u.name) <= 2
                THEN LEFT(u.name, 1) || REPEAT('*', GREATEST(char_length(u.name) - 1, 1))
                ELSE LEFT(u.name, 1) || REPEAT('*', char_length(u.name) - 2) || RIGHT(u.name, 1)
              END AS bidder_name
       FROM bids b
       JOIN users u ON u.id = b.bidder_id
       WHERE b.lot_id = $1
       ORDER BY b.created_at ASC`,
      [req.params.id]
    );

    res.json({
      lot: toPublicDemoLot(rows[0]),
      bids: bids.map((bid) => ({ ...bid, bidder_name: 'Conta de teste' })),
    });
  } catch (err) {
    console.error('[lots/get]', err.message);
    res.status(500).json({ error: 'Erro ao buscar lote.' });
  }
});

// ─── POST /api/lots — criar lote (leiloeiro)
router.post('/', authMiddleware, requireRole('leiloeiro'), async (req, res) => {
  const { title, description, image_url, external_data, initial_bid, min_increment, starts_at, ends_at } = req.body;

  if (typeof title !== 'string' || !title.trim() || title.trim().length > 255 ||
      initial_bid === undefined || !starts_at || !ends_at) {
    return res.status(400).json({ error: 'Campos obrigatórios: title, initial_bid, starts_at, ends_at.' });
  }

  let initialBidCents;
  let incrementCents;
  try {
    initialBidCents = amountToCents(initial_bid);
    incrementCents = amountToCents(min_increment === undefined ? 10 : min_increment);
  } catch {
    return res.status(400).json({ error: 'Valor inicial ou incremento inválido.' });
  }
  if (initialBidCents <= 0n || incrementCents <= 0n) {
    return res.status(400).json({ error: 'Valor inicial e incremento devem ser maiores que zero.' });
  }

  const startsAtDate = new Date(starts_at);
  const endsAtDate = new Date(ends_at);
  if (Number.isNaN(startsAtDate.getTime()) || Number.isNaN(endsAtDate.getTime())) {
    return res.status(400).json({ error: 'Datas de início e encerramento inválidas.' });
  }
  if (endsAtDate <= startsAtDate) {
    return res.status(400).json({ error: 'Data de encerramento deve ser posterior à data de início.' });
  }
  if (endsAtDate <= new Date()) {
    return res.status(400).json({ error: 'A data de encerramento deve estar no futuro.' });
  }

  let client;
  let inTransaction = false;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    inTransaction = true;

    const now = new Date();
    const status = startsAtDate <= now ? 'ao_vivo' : 'agendado';

    const { rows } = await client.query(
      `INSERT INTO lots
        (auctioneer_id, title, description, image_url, external_data, initial_bid, min_increment, current_bid, status, starts_at, ends_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        req.user.id, title.trim(), description, image_url,
        external_data ? JSON.stringify(external_data) : null,
        centsToAmount(initialBidCents), centsToAmount(incrementCents), centsToAmount(initialBidCents),
        status, startsAtDate.toISOString(), endsAtDate.toISOString()
      ]
    );

    await client.query(
      `INSERT INTO audit_log (lot_id, event_type, payload)
       VALUES ($1, 'lot_created', $2)`,
      [rows[0].id, JSON.stringify({ auctioneer_id: req.user.id, title: title.trim() })]
    );

    await client.query('COMMIT');
    inTransaction = false;
    res.status(201).json({ lot: toPublicDemoLot(rows[0]) });
  } catch (err) {
    if (client && inTransaction) {
      await client.query('ROLLBACK');
    }
    console.error('[lots/create]', err.message);
    res.status(500).json({ error: 'Erro ao criar lote.' });
  } finally {
    if (client) client.release();
  }
});

// ─── DELETE /api/lots/:id — cancelar lote (leiloeiro, sem lances)
router.delete('/:id', authMiddleware, requireRole('leiloeiro'), async (req, res) => {
  let client;
  let inTransaction = false;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    inTransaction = true;

    const { rows } = await client.query(
      'SELECT * FROM lots WHERE id = $1 AND auctioneer_id = $2 FOR UPDATE',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) {
      await client.query('ROLLBACK');
      inTransaction = false;
      return res.status(404).json({ error: 'Lote não encontrado.' });
    }

    const lot = rows[0];
    if (lot.status === 'encerrado') {
      await client.query('ROLLBACK');
      inTransaction = false;
      return res.status(400).json({ error: 'Lote já encerrado não pode ser cancelado.' });
    }

    // Verificar se tem lances — não pode cancelar
    const { rows: bids } = await client.query(
      'SELECT id FROM bids WHERE lot_id = $1 LIMIT 1',
      [req.params.id]
    );

    if (bids.length > 0) {
      await client.query('ROLLBACK');
      inTransaction = false;
      return res.status(400).json({ error: 'Lotes com lances não podem ser cancelados.' });
    }

    await client.query(
      `UPDATE lots SET status = 'cancelado' WHERE id = $1`,
      [req.params.id]
    );

    await client.query(
      `INSERT INTO audit_log (lot_id, event_type, payload)
       VALUES ($1, 'lot_cancelled', $2)`,
      [req.params.id, JSON.stringify({ cancelled_by: req.user.id })]
    );

    await client.query('COMMIT');
    inTransaction = false;
    res.json({ message: 'Lote cancelado com sucesso.' });
  } catch (err) {
    if (client && inTransaction) {
      await client.query('ROLLBACK');
    }
    console.error('[lots/cancel]', err.message);
    res.status(500).json({ error: 'Erro ao cancelar lote.' });
  } finally {
    if (client) client.release();
  }
});

// ─── GET /api/lots/auctioneer/my — lotes do leiloeiro logado
router.get('/auctioneer/my', authMiddleware, requireRole('leiloeiro'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT l.id, l.title, l.description, l.image_url, l.external_data,
              l.initial_bid, l.min_increment, l.current_bid, l.status,
              l.starts_at, l.ends_at, l.created_at,
              CASE WHEN wu.id IS NULL THEN NULL
                WHEN char_length(wu.name) <= 2
                  THEN LEFT(wu.name, 1) || REPEAT('*', GREATEST(char_length(wu.name) - 1, 1))
                ELSE LEFT(wu.name, 1) || REPEAT('*', char_length(wu.name) - 2) || RIGHT(wu.name, 1)
              END AS winner_name,
              (SELECT COUNT(*) FROM bids WHERE lot_id = l.id) AS total_bids
       FROM lots l
       LEFT JOIN users wu ON wu.id = l.winner_id
       WHERE l.auctioneer_id = $1
       ORDER BY l.created_at DESC`,
      [req.user.id]
    );
    res.json({ lots: rows.map(toPublicDemoLot) });
  } catch (err) {
    console.error('[lots/auctioneer/my]', err.message);
    res.status(500).json({ error: 'Erro ao buscar seus lotes.' });
  }
});

// ─── GET /api/lots/search/external — buscar itens na Open Library API
router.get('/search/external', authMiddleware, requireRole('leiloeiro'), async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Parâmetro de busca "q" é obrigatório.' });

  try {
    const response = await axios.get(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&fields=key,title,author_name,cover_i,first_publish_year,subject&limit=10`,
      { timeout: 8000 }
    );

    const books = (response.data.docs || []).map((b) => ({
      key: b.key,
      title: b.title,
      author: b.author_name ? b.author_name[0] : 'Autor desconhecido',
      cover_url: null,
      year: b.first_publish_year,
      subjects: b.subject ? b.subject.slice(0, 5) : [],
      source: 'Open Library',
    }));

    res.json({ results: books });
  } catch (err) {
    // Se a API externa cair, retornamos erro gracioso mas a plataforma continua funcionando
    console.error('[external/search]', err.message);
    res.status(503).json({
      error: 'Busca da Open Library temporariamente indisponível. Tente novamente mais tarde.',
      results: [],
    });
  }
});

module.exports = router;
