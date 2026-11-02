/**
 * Arremate MH — Backend Server
 * Modelo demonstrativo de projeto por Manoela Harrison
 *
 * Tecnologias: Node.js + Express + PostgreSQL + Socket.io
 */

require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const pool = require('./db/pool');
const closeDueLots = require('./services/closeDueLots');
const { isOriginAllowed } = require('./utils/cors');
const server = http.createServer(app);
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// ── Socket.io (tempo real de lances)
const io = new Server(server, {
  cors: {
    origin(origin, callback) {
      return callback(
        null,
        isOriginAllowed(origin, allowedOrigins, process.env.NODE_ENV === 'production'),
      );
    },
    methods: ['GET', 'POST'],
  },
});

app.set('publishLotEvent', async (topic, event, payload) => {
  io.to(topic).emit(event, payload);
});

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
    closeDueLots((topic, event, payload) => io.to(topic).emit(event, payload))
      .catch((err) => console.error('[job/closeDueLots]', err.message));
  }, 30 * 1000);
  closeDueLots((topic, event, payload) => io.to(topic).emit(event, payload))
    .catch((err) => console.error('[job/closeDueLots]', err.message));
  console.log('⏱️  Job de encerramento automático ativo (30s)');
  console.log('');
});

module.exports = { app, server, io, closeDueLots };
