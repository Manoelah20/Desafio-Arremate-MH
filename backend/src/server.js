/**
 * Arremate MH — Backend Server
 * Desafio Técnico por Manoela Harrison
 *
 * Tecnologias: Node.js + Express + PostgreSQL + Socket.io
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const pool = require('./db/pool');

// ── Rotas
const authRoutes = require('./routes/auth');
const lotsRoutes = require('./routes/lots');
const bidsRoutes = require('./routes/bids');
const auditRoutes = require('./routes/audit');

const app = express();
const server = http.createServer(app);

// ── Socket.io (tempo real de lances)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
  },
});

// Torna io acessível nas rotas (para emitir eventos após lance)
app.set('io', io);

// ── Middlewares globais
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// ── Rota de saúde (health check para Railway)
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', service: 'arremate-mh-backend' });
  } catch (err) {
    console.error('[health]', err.message);
    res.status(503).json({ status: 'error', service: 'arremate-mh-backend' });
  }
});

// ── Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/lots', lotsRoutes);
app.use('/api/bids', bidsRoutes);
app.use('/api/audit', auditRoutes);

// ── Socket.io — Gerenciamento de salas de leilão
io.on('connection', (socket) => {
  console.log(`[socket] Conectado: ${socket.id}`);

  // Entrar na sala de um lote específico
  socket.on('join_lot', (lotId) => {
    socket.join(`lot:${lotId}`);
    console.log(`[socket] ${socket.id} entrou na sala lot:${lotId}`);
  });

  // Sair da sala
  socket.on('leave_lot', (lotId) => {
    socket.leave(`lot:${lotId}`);
  });

  socket.on('disconnect', () => {
    console.log(`[socket] Desconectado: ${socket.id}`);
  });
});

// ── Job de encerramento automático de lotes (roda a cada 30s)
async function closeDueLots() {
  const { rows: dueLots } = await pool.query(
    `SELECT id FROM lots
     WHERE ends_at <= NOW()
       AND (status = 'ao_vivo' OR (status = 'agendado' AND starts_at <= NOW()))
     ORDER BY ends_at`
  );

  for (const dueLot of dueLots) {
    const client = await pool.connect();
    let inTransaction = false;
    let closedLot;

    try {
      await client.query('BEGIN');
      inTransaction = true;
      const { rows } = await client.query(
        `SELECT l.id, l.status, l.auctioneer_id, l.winner_id, l.current_bid,
                (SELECT u.name FROM users u WHERE u.id = l.winner_id) AS winner_name
         FROM lots l
         WHERE l.id = $1 AND l.ends_at <= NOW()
           AND (l.status = 'ao_vivo' OR (l.status = 'agendado' AND l.starts_at <= NOW()))
         FOR UPDATE SKIP LOCKED`,
        [dueLot.id]
      );

      if (rows.length === 0) {
        await client.query('COMMIT');
        inTransaction = false;
        continue;
      }

      const lot = rows[0];
      if (lot.status === 'ao_vivo' && lot.winner_id && Number(lot.current_bid) > 0) {
        const { rows: debited } = await client.query(
          `UPDATE users SET balance = balance - $1
           WHERE id = $2 AND balance >= $1
           RETURNING id`,
          [lot.current_bid, lot.winner_id]
        );
        if (debited.length === 0) {
          throw new Error(`Saldo insuficiente para liquidar o lote ${lot.id}.`);
        }

        const { rows: credited } = await client.query(
          `UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING id`,
          [lot.current_bid, lot.auctioneer_id]
        );
        if (credited.length === 0) {
          throw new Error(`Leiloeiro não encontrado para liquidar o lote ${lot.id}.`);
        }
      }

      await client.query(
        `UPDATE lots SET status = 'encerrado' WHERE id = $1`,
        [lot.id]
      );
      await client.query(
        `INSERT INTO audit_log (lot_id, event_type, payload) VALUES ($1, 'lot_closed', $2)`,
        [lot.id, JSON.stringify({ winner_id: lot.winner_id, final_bid: lot.current_bid })]
      );
      await client.query('COMMIT');
      inTransaction = false;
      closedLot = lot;
    } catch (err) {
      if (inTransaction) {
        await client.query('ROLLBACK');
      }
      console.error(`[job/closeDueLots/${dueLot.id}]`, err.message);
    } finally {
      client.release();
    }

    if (closedLot) {
      io.to(`lot:${closedLot.id}`).emit('lot_closed', {
        lot_id: closedLot.id,
        winner_name: closedLot.winner_name ? maskName(closedLot.winner_name) : null,
        final_bid: parseFloat(closedLot.current_bid),
      });
      console.log(`[job] Lote ${closedLot.id} encerrado. Vencedor: ${closedLot.winner_id || 'Nenhum'}`);
    }
  }

  await pool.query(
    `UPDATE lots SET status = 'ao_vivo'
     WHERE status = 'agendado' AND starts_at <= NOW() AND ends_at > NOW()`
  );
}

// ── Inicializar servidor
const PORT = process.env.PORT || 3001;
server.listen(PORT, async () => {
  console.log('');
  console.log('🏛️  Arremate MH — Backend');
  console.log(`🚀  Servidor rodando em http://localhost:${PORT}`);
  console.log(`🔌  WebSocket ativo`);
  console.log('');

  // Testar conexão com banco
  try {
    await pool.query('SELECT 1');
    console.log('✅  PostgreSQL conectado');
  } catch (err) {
    console.error('❌  Erro ao conectar ao PostgreSQL:', err.message);
    console.error('    Verifique DATABASE_URL no arquivo .env');
  }

  // Iniciar job de encerramento
  setInterval(() => {
    closeDueLots().catch((err) => console.error('[job/closeDueLots]', err.message));
  }, 30 * 1000);
  closeDueLots().catch((err) => console.error('[job/closeDueLots]', err.message));
  console.log('⏱️  Job de encerramento automático ativo (30s)');
  console.log('');
});

module.exports = { app, server, io };
