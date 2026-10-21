import dotenv from 'dotenv';
import pool from './src/config/database';
async function main() {
  try {
    const result = await pool.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_type = 'BASE TABLE'
        AND table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name
    `);
    console.table(result.rows);
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
}
main();
