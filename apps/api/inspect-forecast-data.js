require('dotenv').config();
const { Client } = require('pg');
const client = new Client({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'sasm_db',
  password: process.env.DB_PASSWORD || 'Zed1929@!@!',
  port: Number(process.env.DB_PORT) || 5432
});
async function main() {
  try {
    await client.connect();
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'app'
        AND table_name = 'market_prices'
      ORDER BY ordinal_position;
    `);
    console.log('MARKET PRICE COLUMNS:');
    console.table(columns.rows);
    const prices = await client.query(`
      SELECT *
      FROM app.market_prices
      ORDER BY price_id DESC
      LIMIT 10;
    `);
    console.log('LATEST MARKET PRICE RECORDS:');
    console.table(prices.rows);
  } catch (error) {
    console.error('Database error:', error.message);
  } finally {
    await client.end().catch(() => {});
  }
}
main();
