const pool = require('../db/pool');
const { maskName } = require('../utils/bid');

async function closeDueLots(publishEvent = async () => {}) {
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
        'UPDATE lots SET status = $1 WHERE id = $2',
        ['encerrado', lot.id]
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
      try {
        await publishEvent(`lot:${closedLot.id}`, 'lot_closed', {
          lot_id: closedLot.id,
          winner_name: closedLot.winner_name ? maskName(closedLot.winner_name) : null,
          final_bid: Number(closedLot.current_bid),
        });
      } catch (err) {
        console.error(`[realtime/lot_closed/${closedLot.id}]`, err.message);
      }
      console.log(`[job] Lote ${closedLot.id} encerrado. Vencedor: ${closedLot.winner_id || 'Nenhum'}`);
    }
  }

  await pool.query(
    `UPDATE lots SET status = 'ao_vivo'
     WHERE status = 'agendado' AND starts_at <= NOW() AND ends_at > NOW()`
  );
}

module.exports = closeDueLots;
