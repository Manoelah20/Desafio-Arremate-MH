require('dotenv').config();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const pool = require('./pool');
const { createBidHash } = require('../utils/bid');

const DEMO_PREFIX = 'arremate-demo-v1';
const AUCTIONEER_EMAIL = 'demo.leiloeiro@arrematemh.com';
const BIDDER_EMAIL = 'demo.licitante@arrematemh.com';
const ZERO_HASH = '0'.repeat(64);

function demoPassword() {
  return crypto.randomBytes(18).toString('base64url');
}

async function seedDemo() {
  if (process.env.ALLOW_DEMO_SEED !== DEMO_PREFIX) {
    throw new Error(`Defina ALLOW_DEMO_SEED=${DEMO_PREFIX} para confirmar a criação dos dados.`);
  }

  const databaseUrl = new URL(process.env.DATABASE_URL);
  if (!databaseUrl.hostname.endsWith('.pooler.supabase.com')) {
    throw new Error('O seed de demonstração só pode ser executado em um PostgreSQL do Supabase.');
  }

  const client = await pool.connect();
  let inTransaction = false;

  try {
    await client.query('BEGIN');
    inTransaction = true;

    const { rows: existingLots } = await client.query(
      `SELECT id FROM lots
       WHERE external_data->>'demo_key' LIKE $1
       LIMIT 1`,
      [`${DEMO_PREFIX}-%`]
    );
    if (existingLots.length > 0) {
      await client.query('ROLLBACK');
      inTransaction = false;
      console.log('Dados demonstrativos já existem; nenhuma alteração foi feita.');
      return;
    }

    const { rows: existingUsers } = await client.query(
      'SELECT email FROM users WHERE email = ANY($1::text[])',
      [[AUCTIONEER_EMAIL, BIDDER_EMAIL]]
    );
    if (existingUsers.length > 0) {
      throw new Error(
        `Não foi possível criar as contas de demonstração: e-mail já cadastrado (${existingUsers.map((user) => user.email).join(', ')}). Nenhum dado foi alterado.`
      );
    }

    const auctioneerPassword = demoPassword();
    const bidderPassword = demoPassword();
    const auctioneerHash = await bcrypt.hash(auctioneerPassword, 10);
    const bidderHash = await bcrypt.hash(bidderPassword, 10);

    const { rows: [auctioneer] } = await client.query(
      `INSERT INTO users (name, email, password, role, balance)
       VALUES ($1, $2, $3, 'leiloeiro', 0)
       RETURNING id`,
      ['Leiloeiro de Demonstração', AUCTIONEER_EMAIL, auctioneerHash]
    );
    const { rows: [bidder] } = await client.query(
      `INSERT INTO users (name, email, password, role, balance)
       VALUES ($1, $2, $3, 'licitante', 1000)
       RETURNING id`,
      ['Licitante de Demonstração', BIDDER_EMAIL, bidderHash]
    );

    const now = Date.now();
    const lots = [
      {
        key: `${DEMO_PREFIX}-live-with-bid`,
        title: 'Relógio de Coleção — Submariner (Demonstração)',
        description: 'Lote demonstrativo sem valor comercial. Use outra conta de licitante para testar um novo lance.',
        imageUrl: 'https://desafio-arremate-mh.vercel.app/rolex-submariner.jpg',
        externalData: { source: 'Demonstração', demo_key: `${DEMO_PREFIX}-live-with-bid`, subjects: ['Relógios'] },
        initialBid: '250.00',
        increment: '25.00',
        currentBid: '250.00',
        winnerId: bidder.id,
        status: 'ao_vivo',
        startsAt: new Date(now - 15 * 60_000),
        endsAt: new Date(now + 2 * 24 * 60 * 60_000),
      },
      {
        key: `${DEMO_PREFIX}-live-open`,
        title: 'Volkswagen 1600 TL 1972 (Lote Demonstrativo)',
        description: 'Lote demonstrativo sem valor comercial. Disponível para testar o primeiro lance.',
        imageUrl: 'https://desafio-arremate-mh.vercel.app/vw-classico-azul.jpg',
        externalData: { source: 'Demonstração', demo_key: `${DEMO_PREFIX}-live-open`, subjects: ['Veículos'] },
        initialBid: '100.00',
        increment: '10.00',
        currentBid: '100.00',
        winnerId: null,
        status: 'ao_vivo',
        startsAt: new Date(now - 10 * 60_000),
        endsAt: new Date(now + 3 * 24 * 60 * 60_000),
      },
      {
        key: `${DEMO_PREFIX}-upcoming`,
        title: 'Mercedes-AMG GT Coupé (Leilão Demonstrativo Agendado)',
        description: 'Lote demonstrativo sem valor comercial. Leilão agendado para permitir visualizar o estado futuro.',
        imageUrl: 'https://desafio-arremate-mh.vercel.app/mercedes-amg-gt.jpg',
        externalData: { source: 'Demonstração', demo_key: `${DEMO_PREFIX}-upcoming`, subjects: ['Veículos'] },
        initialBid: '500.00',
        increment: '50.00',
        currentBid: '500.00',
        winnerId: null,
        status: 'agendado',
        startsAt: new Date(now + 24 * 60 * 60_000),
        endsAt: new Date(now + 48 * 60 * 60_000),
      },
      {
        key: `${DEMO_PREFIX}-closed`,
        title: 'Cadillac Coupe de Ville 1959 (Lote Demonstrativo Encerrado)',
        description: 'Lote demonstrativo sem valor comercial, encerrado sem lances.',
        imageUrl: 'https://desafio-arremate-mh.vercel.app/cadillac-1959-pink.jpg',
        externalData: { source: 'Demonstração', demo_key: `${DEMO_PREFIX}-closed`, subjects: ['Veículos'] },
        initialBid: '350.00',
        increment: '35.00',
        currentBid: '350.00',
        winnerId: null,
        status: 'encerrado',
        startsAt: new Date(now - 3 * 60 * 60_000),
        endsAt: new Date(now - 60 * 60_000),
      },
    ];

    const lotIds = {};
    for (const lot of lots) {
      const { rows: [createdLot] } = await client.query(
        `INSERT INTO lots
          (auctioneer_id, title, description, image_url, external_data,
           initial_bid, min_increment, current_bid, winner_id, status, starts_at, ends_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING id`,
        [
          auctioneer.id,
          lot.title,
          lot.description,
          lot.imageUrl,
          JSON.stringify(lot.externalData),
          lot.initialBid,
          lot.increment,
          lot.currentBid,
          lot.winnerId,
          lot.status,
          lot.startsAt.toISOString(),
          lot.endsAt.toISOString(),
        ]
      );
      lotIds[lot.key] = createdLot.id;

      await client.query(
        `INSERT INTO audit_log (lot_id, event_type, payload)
         VALUES ($1, 'lot_created', $2)`,
        [createdLot.id, JSON.stringify({ auctioneer_id: auctioneer.id, demo: true })]
      );
    }

    const bidId = crypto.randomUUID();
    const bidCreatedAt = new Date(now - 5 * 60_000).toISOString();
    const bidAmount = '250.00';
    const bidHash = createBidHash(
      ZERO_HASH,
      bidId,
      lotIds[`${DEMO_PREFIX}-live-with-bid`],
      bidder.id,
      bidAmount,
      bidCreatedAt
    );

    await client.query(
      `INSERT INTO bids (id, lot_id, bidder_id, amount, chain_hash, prev_hash, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        bidId,
        lotIds[`${DEMO_PREFIX}-live-with-bid`],
        bidder.id,
        bidAmount,
        bidHash,
        ZERO_HASH,
        bidCreatedAt,
      ]
    );
    await client.query(
      `INSERT INTO audit_log (lot_id, event_type, payload)
       VALUES ($1, 'bid', $2)`,
      [
        lotIds[`${DEMO_PREFIX}-live-with-bid`],
        JSON.stringify({
          bid_id: bidId,
          bidder_id: bidder.id,
          amount: bidAmount,
          chain_hash: bidHash,
        }),
      ]
    );

    await client.query('COMMIT');
    inTransaction = false;

    console.log(JSON.stringify({
      message: 'Dados demonstrativos criados sem remover dados existentes.',
      accounts: [
        { role: 'leiloeiro', email: AUCTIONEER_EMAIL, password: auctioneerPassword },
        { role: 'licitante', email: BIDDER_EMAIL, password: bidderPassword },
      ],
      lots: Object.keys(lotIds).length,
    }, null, 2));
  } catch (error) {
    if (inTransaction) await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDemo().catch((error) => {
  console.error('Falha ao criar dados demonstrativos:', error.message);
  process.exitCode = 1;
});
