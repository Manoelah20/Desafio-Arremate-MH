require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db/pool');
const closeDueLots = require('./services/closeDueLots');
const { isOriginAllowed } = require('./utils/cors');

const authRoutes = require('./routes/auth');
const lotsRoutes = require('./routes/lots');
const bidsRoutes = require('./routes/bids');
const auditRoutes = require('./routes/audit');

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
  throw new Error('FRONTEND_URL deve ser configurada em produção para restringir o CORS.');
}

app.use(cors({
  origin(origin, callback) {
    return callback(
      null,
      isOriginAllowed(origin, allowedOrigins, process.env.NODE_ENV === 'production'),
    );
  },
}));
app.use(express.json({ limit: '1mb' }));

app.use(async (req, res, next) => {
  if (!app.get('runDueLotCheck') || req.method === 'OPTIONS') return next();

  try {
    await closeDueLots(app.get('publishLotEvent'));
  } catch (err) {
    console.error('[job/closeDueLots]', err.message);
  }
  return next();
});

app.get(['/health', '/api/health'], async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', service: 'arremate-mh-backend' });
  } catch (err) {
    console.error('[health]', err.message);
    res.status(503).json({ status: 'error', service: 'arremate-mh-backend' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/lots', lotsRoutes);
app.use('/api/bids', bidsRoutes);
app.use('/api/audit', auditRoutes);

module.exports = app;
