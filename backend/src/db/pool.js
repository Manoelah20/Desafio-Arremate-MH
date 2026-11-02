const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL não configurada. Defina uma URL de conexão PostgreSQL.');
}

try {
  const databaseUrl = new URL(connectionString);
  if (!['postgres:', 'postgresql:'].includes(databaseUrl.protocol) || !databaseUrl.hostname) {
    throw new Error('invalid PostgreSQL URL');
  }
} catch {
  throw new Error(
    'DATABASE_URL inválida. Use o formato postgresql://usuario:senha@host:5432/banco.'
  );
}

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: Number(process.env.PG_POOL_MAX || (process.env.NODE_ENV === 'production' ? 1 : 10)),
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool do PostgreSQL:', err);
});

module.exports = pool;
