const express = require('express');
const crypto = require('crypto');
const pool = require('../db/pool');
const { amountToCents, createBidHash } = require('../utils/bid');
const { toPublicDemoLot } = require('../utils/demoLot');

const router = express.Router();

// ─── GET /api/audit/:lot_id — histórico público + verificação de integridade
router.get('/:lot_id', async (req, res) => {
  try {
    const { rows: lots } = await pool.query(
      `SELECT l.id, l.title, l.external_data, l.status, l.initial_bid, l.current_bid,
              l.starts_at, l.ends_at, l.winner_id,
              CASE WHEN wu.id IS NULL THEN NULL
                WHEN char_length(wu.name) <= 2
                  THEN LEFT(wu.name, 1) || REPEAT('*', GREATEST(char_length(wu.name) - 1, 1))
                ELSE LEFT(wu.name, 1) || REPEAT('*', char_length(wu.name) - 2) || RIGHT(wu.name, 1)
              END AS winner_display
       FROM lots l
       LEFT JOIN users wu ON wu.id = l.winner_id
       WHERE l.id = $1`,
      [req.params.lot_id]
    );

    if (lots.length === 0) {
      return res.status(404).json({ error: 'Lote não encontrado.' });
    }

    const { rows: bids } = await pool.query(
      `SELECT b.id, b.lot_id, b.bidder_id, b.amount,
              b.chain_hash, b.prev_hash, b.created_at,
              -- Mascarar nome do licitante para privacidade (apenas iniciais)
              CASE WHEN char_length(u.name) <= 2
                THEN LEFT(u.name, 1) || REPEAT('*', GREATEST(char_length(u.name) - 1, 1))
                ELSE LEFT(u.name, 1) || REPEAT('*', char_length(u.name) - 2) || RIGHT(u.name, 1)
              END AS bidder_display
       FROM bids b
       JOIN users u ON u.id = b.bidder_id
       WHERE b.lot_id = $1
       ORDER BY b.created_at ASC, b.id ASC`,
      [req.params.lot_id]
    );
    const { rows: bidEvents } = await pool.query(
      `SELECT payload FROM audit_log
       WHERE lot_id = $1 AND event_type = 'bid'`,
      [req.params.lot_id]
    );

    // ── Verificar integridade da cadeia de hashes
    let isIntact = bidEvents.length === bids.length;
    let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
    const verifiedBids = [];
    const eventsByBidId = new Map();

    for (const { payload } of bidEvents) {
      if (!payload || typeof payload !== 'object' || typeof payload.bid_id !== 'string') {
        isIntact = false;
        continue;
      }
      const events = eventsByBidId.get(payload.bid_id) || [];
      events.push(payload);
      eventsByBidId.set(payload.bid_id, events);
    }

    for (const bid of bids) {
      let expectedHash;
      try {
        expectedHash = createBidHash(prevHash, bid.id, bid.lot_id, bid.bidder_id, bid.amount, bid.created_at);
      } catch {
        expectedHash = '';
      }

      const valid = expectedHash === bid.chain_hash && bid.prev_hash === prevHash;
      if (!valid) isIntact = false;

      const [event] = eventsByBidId.get(bid.id) || [];
      let eventValid = true;
      try {
        if (!event || event.chain_hash !== bid.chain_hash ||
            event.bidder_id !== bid.bidder_id ||
            amountToCents(event.amount) !== amountToCents(bid.amount) ||
            (eventsByBidId.get(bid.id) || []).length !== 1) {
          eventValid = false;
        }
      } catch {
        eventValid = false;
      }
      if (!eventValid) isIntact = false;

      const { bidder_id: _, ...publicBid } = bid;
      verifiedBids.push({
        ...publicBid,
        bidder_display: 'Conta de teste',
        verified: valid && eventValid,
      });
      prevHash = bid.chain_hash;
    }

    const lot = lots[0];
    try {
      if (bids.length > 0) {
        const lastBid = bids[bids.length - 1];
        if (lot.winner_id !== lastBid.bidder_id ||
            amountToCents(lot.current_bid) !== amountToCents(lastBid.amount)) {
          isIntact = false;
        }
      } else if (lot.winner_id || amountToCents(lot.current_bid) !== amountToCents(lot.initial_bid)) {
        isIntact = false;
      }
    } catch {
      isIntact = false;
    }

    const { winner_id: _, ...publicLot } = lot;
    res.json({
      lot: toPublicDemoLot(publicLot),
      bids: verifiedBids,
      audit: {
        is_intact: isIntact,
        total_bids: bids.length,
        message: isIntact
          ? 'Cadeia de hashes do ambiente de demonstração verificada; isso não constitui auditoria independente.'
          : 'A cadeia de hashes de teste não foi validada.',
      },
    });
  } catch (err) {
    console.error('[audit]', err.message);
    res.status(500).json({ error: 'Erro ao auditar lote.' });
  }
});

// ─── GET /api/audit/:lot_id/receipt — comprovante público do arremate
router.get('/:lot_id/receipt', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT l.id, l.title, l.image_url, l.current_bid AS winning_bid,
              l.initial_bid, l.ends_at, l.status,
              wu.id AS winner_id,
              CASE WHEN wu.id IS NULL THEN NULL
                WHEN char_length(wu.name) <= 2
                  THEN LEFT(wu.name, 1) || REPEAT('*', GREATEST(char_length(wu.name) - 1, 1))
                ELSE LEFT(wu.name, 1) || REPEAT('*', char_length(wu.name) - 2) || RIGHT(wu.name, 1)
              END AS winner_display,
              au.name AS auctioneer_name,
              (SELECT COUNT(*) FROM bids WHERE lot_id = l.id) AS total_bids
       FROM lots l
       JOIN users au ON au.id = l.auctioneer_id
       LEFT JOIN users wu ON wu.id = l.winner_id
       WHERE l.id = $1 AND l.status = 'encerrado'`,
      [req.params.lot_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Comprovante não disponível. O lote pode ainda estar em andamento.' });
    }

    const { winner_id: winnerId, ...receiptData } = rows[0];
    const receipt = {
      ...receiptData,
      title: 'Lote demonstrativo encerrado',
      image_url: '/demo-lot.svg',
      auctioneer_name: 'Conta de demonstração',
      winner_display: winnerId ? 'Conta de teste' : null,
      demo: true,
      disclaimer: 'Registro de teste sem validade comercial, financeira ou jurídica.',
      receipt_id: crypto
        .createHash('sha256')
        .update(`${req.params.lot_id}${rows[0].winning_bid}${winnerId}`)
        .digest('hex')
        .slice(0, 16)
        .toUpperCase(),
      generated_at: new Date().toISOString(),
    };

    res.json({ receipt });
  } catch (err) {
    console.error('[audit/receipt]', err.message);
    res.status(500).json({ error: 'Erro ao gerar comprovante.' });
  }
});

module.exports = router;
