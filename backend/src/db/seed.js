// seed.js — Dados iniciais para teste
// 1 leiloeiro + 2 licitantes + 3 lotes (ao vivo, encerrado e agendado)

require('dotenv').config();
const pool = require('./pool');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { createBidHash } = require('../utils/bid');

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ─── Criar tabelas (se ainda não existirem)
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(schemaSql);

    // ─── Limpar dados anteriores (ordem importa por FK)
    await client.query('DELETE FROM audit_log');
    await client.query('DELETE FROM bids');
    await client.query('DELETE FROM lots');
    await client.query('DELETE FROM users');

    // ─── Usuários
    const leiloeiroPass = await bcrypt.hash('senha123', 10);
    const licitante1Pass = await bcrypt.hash('senha123', 10);
    const licitante2Pass = await bcrypt.hash('senha123', 10);

    const { rows: [leiloeiro] } = await client.query(
      `INSERT INTO users (name, email, password, role, balance)
       VALUES ($1, $2, $3, 'leiloeiro', 0) RETURNING id`,
      ['Leiloeiro de Demonstração', 'demo.auctioneer@example.test', leiloeiroPass]
    );

    const { rows: [licitante1] } = await client.query(
      `INSERT INTO users (name, email, password, role, balance)
       VALUES ($1, $2, $3, 'licitante', 5000.00) RETURNING id`,
      ['Conta de Teste 1', 'demo.bidder1@example.test', licitante1Pass]
    );

    const { rows: [licitante2] } = await client.query(
      `INSERT INTO users (name, email, password, role, balance)
       VALUES ($1, $2, $3, 'licitante', 3000.00) RETURNING id`,
      ['Conta de Teste 2', 'demo.bidder2@example.test', licitante2Pass]
    );

    console.log('✅ Usuários criados');

    // ─── Lote 1: ao_vivo (começa agora, termina em 2 horas)
    const lot1StartsAt = new Date(Date.now() - 1000 * 60 * 10); // começou 10 min atrás
    const lot1EndsAt = new Date(Date.now() + 1000 * 60 * 120);   // termina em 2h

    const { rows: [lot1] } = await client.query(
      `INSERT INTO lots
        (auctioneer_id, title, description, image_url, external_data, initial_bid, min_increment, current_bid, status, starts_at, ends_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'ao_vivo', $9, $10)
       RETURNING id`,
      [
        leiloeiro.id,
        'Lote demonstrativo — item de coleção 01',
        'Item e informações fictícios para testar o cadastro, os lances e o histórico. Não representam um produto real.',
        null,
        JSON.stringify({ source: 'Demonstração', demo: true, demo_key: 'seed-demo-lot-01', subjects: ['Colecionáveis'] }),
        250.00,
        25.00,
        250.00,
        lot1StartsAt.toISOString(),
        lot1EndsAt.toISOString(),
      ]
    );

    // Lances no lote 1
    let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';
    const bidsLot1 = [
      { bidderId: licitante1.id, amount: 250.00 },
      { bidderId: licitante2.id, amount: 275.00 },
      { bidderId: licitante1.id, amount: 300.00 },
    ];

    let bidIndex = 0;
    const seedTimestamp = Date.now();
    for (const b of bidsLot1) {
      const bidId = crypto.randomUUID();
      const createdAt = new Date(seedTimestamp + bidIndex++).toISOString();
      const hash = createBidHash(prevHash, bidId, lot1.id, b.bidderId, b.amount, createdAt);

      await client.query(
        `INSERT INTO bids (id, lot_id, bidder_id, amount, chain_hash, prev_hash, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [bidId, lot1.id, b.bidderId, b.amount, hash, prevHash, createdAt]
      );
      prevHash = hash;

      await client.query(
        `INSERT INTO audit_log (lot_id, event_type, payload)
         VALUES ($1, 'bid', $2)`,
        [lot1.id, JSON.stringify({
          bid_id: bidId,
          bidder_id: b.bidderId,
          amount: b.amount.toFixed(2),
          chain_hash: hash,
        })]
      );
    }

    // Atualizar lance atual do lote 1
    await client.query(
      `UPDATE lots SET current_bid = $1, winner_id = $2 WHERE id = $3`,
      [300.00, licitante1.id, lot1.id]
    );

    // ─── Lote 2: encerrado (com vencedor)
    const lot2StartsAt = new Date(Date.now() - 1000 * 60 * 60 * 3);
    const lot2EndsAt = new Date(Date.now() - 1000 * 60 * 30);

    const { rows: [lot2] } = await client.query(
      `INSERT INTO lots
        (auctioneer_id, title, description, image_url, external_data, initial_bid, min_increment, current_bid, winner_id, status, starts_at, ends_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'encerrado', $10, $11)
       RETURNING id`,
      [
        leiloeiro.id,
        'Lote demonstrativo — item de coleção 02',
        'Item e informações fictícios para testar a listagem e o encerramento. Não representam um produto real.',
        null,
        JSON.stringify({ source: 'Demonstração', demo: true, demo_key: 'seed-demo-lot-02', subjects: ['Colecionáveis'] }),
        500.00,
        50.00,
        750.00,
        licitante2.id,
        lot2StartsAt.toISOString(),
        lot2EndsAt.toISOString(),
      ]
    );

    let lot2PrevHash = '0000000000000000000000000000000000000000000000000000000000000000';
    const lot2Bids = [
      { bidderId: licitante1.id, amount: 500.00 },
      { bidderId: licitante2.id, amount: 750.00 },
    ];
    for (let index = 0; index < lot2Bids.length; index += 1) {
      const bid = lot2Bids[index];
      const bidId = crypto.randomUUID();
      const createdAt = new Date(lot2EndsAt.getTime() - 2_000 + index * 1_000).toISOString();
      const hash = createBidHash(lot2PrevHash, bidId, lot2.id, bid.bidderId, bid.amount, createdAt);
      await client.query(
        `INSERT INTO bids (id, lot_id, bidder_id, amount, chain_hash, prev_hash, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [bidId, lot2.id, bid.bidderId, bid.amount, hash, lot2PrevHash, createdAt]
      );
      await client.query(
        `INSERT INTO audit_log (lot_id, event_type, payload)
         VALUES ($1, 'bid', $2)`,
        [lot2.id, JSON.stringify({
          bid_id: bidId,
          bidder_id: bid.bidderId,
          amount: bid.amount.toFixed(2),
          chain_hash: hash,
        })]
      );
      lot2PrevHash = hash;
    }

    await client.query(
      `INSERT INTO audit_log (lot_id, event_type, payload)
       VALUES ($1, 'lot_closed', $2)`,
      [lot2.id, JSON.stringify({ winner_id: licitante2.id, final_bid: 750.00 })]
    );

    // ─── Lote 3: agendado (para daqui a 1h)
    const lot3StartsAt = new Date(Date.now() + 1000 * 60 * 60);
    const lot3EndsAt = new Date(Date.now() + 1000 * 60 * 60 * 3);

    await client.query(
      `INSERT INTO lots
        (auctioneer_id, title, description, image_url, external_data, initial_bid, min_increment, current_bid, status, starts_at, ends_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'agendado', $9, $10)`,
      [
        leiloeiro.id,
        'Lote demonstrativo — item agendado',
        'Item e informações fictícios para testar o agendamento. Não representam um produto real.',
        null,
        JSON.stringify({ source: 'Demonstração', demo: true, demo_key: 'seed-demo-lot-03', subjects: ['Colecionáveis'] }),
        350.00,
        30.00,
        0.00,
        lot3StartsAt.toISOString(),
        lot3EndsAt.toISOString(),
      ]
    );

    await client.query('COMMIT');
    console.log('');
    console.log('✅ SEED CONCLUÍDO COM SUCESSO!');
    console.log('─────────────────────────────────────');
    console.log('👤 LEILOEIRO:  demo.auctioneer@example.test / senha123');
    console.log('👤 LICITANTE1: demo.bidder1@example.test / senha123');
    console.log('👤 LICITANTE2: demo.bidder2@example.test / senha123');
    console.log('─────────────────────────────────────');
    console.log('🏺 3 lotes criados: 1 ao vivo, 1 encerrado, 1 agendado');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erro no seed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
