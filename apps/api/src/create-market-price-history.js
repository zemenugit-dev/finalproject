
require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'sasm_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function main() {
  try {
    await client.connect();

    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS app.market_price_history (
        history_id BIGSERIAL PRIMARY KEY,
        product_id BIGINT NOT NULL
          REFERENCES app.products(product_id),
        market_id BIGINT NOT NULL
          REFERENCES app.regions_and_markets(market_id),
        price NUMERIC(14, 2) NOT NULL CHECK (price >= 0),
        recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const result = await client.query(`
      INSERT INTO app.market_price_history
        (product_id, market_id, price, recorded_at)
      SELECT
        mp.product_id,
        mp.market_id,
        mp.current_price,
        COALESCE(mp.updated_at, NOW())
      FROM app.market_prices mp
      WHERE mp.product_id IS NOT NULL
        AND mp.market_id IS NOT NULL
        AND mp.current_price IS NOT NULL
        AND NOT EXISTS (
          SELECT 1
          FROM app.market_price_history h
          WHERE h.product_id = mp.product_id
            AND h.market_id = mp.market_id
            AND h.price = mp.current_price
            AND h.recorded_at = COALESCE(mp.updated_at, NOW())
        )
      RETURNING history_id;
    `);

    await client.query('COMMIT');

    console.log('Historical price table is ready.');
    console.log('Initial price records added:', result.rowCount);

    const history = await client.query(`
      SELECT
        h.history_id,
        p.name AS product_name,
        rm.market_name,
        h.price,
        h.recorded_at
      FROM app.market_price_history h
      JOIN app.products p
        ON p.product_id = h.product_id
      JOIN app.regions_and_markets rm
        ON rm.market_id = h.market_id
      ORDER BY h.recorded_at DESC;
    `);

    console.table(history.rows);
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Operation failed:', error.message);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}

main();

