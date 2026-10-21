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
    console.log('Connecting to database...');
    await client.connect();
    const result = await client.query(`
      SELECT history_id, product_id, market_id, price, recorded_at
      FROM app.market_price_history
      WHERE product_id = 1 AND market_id = 1
      ORDER BY recorded_at DESC;
    `);
    console.log('Price history records:');
    console.table(result.rows);
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}
main();

