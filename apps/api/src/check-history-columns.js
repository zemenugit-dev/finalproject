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
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'app'
        AND table_name = 'market_price_history'
      ORDER BY ordinal_position;
    `);
    console.log('Historical price table columns:');
    console.table(result.rows);
  } catch (error) {
    console.error('Database check failed:', error.message);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
}
main();

