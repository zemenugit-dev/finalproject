import pool from './src/config/database';
async function main() {
  try {
    const result = await pool.query(`
      SELECT table_name, column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'app'
        AND table_name IN ('users', 'roles')
      ORDER BY table_name, ordinal_position
    `);
    console.table(result.rows);
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
}
main();
