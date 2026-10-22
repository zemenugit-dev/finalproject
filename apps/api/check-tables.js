require('dotenv').config();
const { Client } = require('pg');
const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});
async function main() {
  try {
    await client.connect();
    const result = await client.query(`
      SELECT
        table_name,
        column_name,
        data_type,
        is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'app'
      ORDER BY table_name, ordinal_position
    `);
    console.table(result.rows);
  } catch (error) {
    console.error(error.message);
  } finally {
    await client.end();
  }
}
main();
