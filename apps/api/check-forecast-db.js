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
    const result = await client.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema = 'app'
        AND table_type = 'BASE TABLE'
        AND (
          table_name ILIKE '%forecast%'
          OR table_name ILIKE '%price%'
          OR table_name ILIKE '%product%'
          OR table_name ILIKE '%market%'
        )
      ORDER BY table_name;
    `);
    console.table(result.rows);
  } catch (error) {
    console.error('Database error:', error.message);
  } finally {
    await client.end().catch(() => {});
  }
}
main();
