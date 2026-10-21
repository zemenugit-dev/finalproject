
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

    const result = await client.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema = 'app'
        AND table_name IN (
          'products',
          'market_prices',
          'regions_and_markets',
          'market_price_history'
        )
      ORDER BY table_name;
    `);

    console.table(result.rows);
  } catch (error) {
    console.error('Database check failed:', error.message);
  } finally {
    await client.end().catch(() => {});
  }
}

main();
