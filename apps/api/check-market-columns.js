const { Client } = require('pg');
require('dotenv').config();
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
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'app'
        AND table_name = 'regions_and_markets'
      ORDER BY ordinal_position;
    `);
    console.table(result.rows);
  } catch (error) {
    console.error('Database error:', error.message);
  } finally {
    await client.end().catch(() => {});
  }
}
main();
