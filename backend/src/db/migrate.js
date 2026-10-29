require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./pool');

async function migrate() {
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(schema);
    console.log('Schema do PostgreSQL aplicado.');
  } catch (error) {
    console.error('Falha ao aplicar o schema:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrate();
