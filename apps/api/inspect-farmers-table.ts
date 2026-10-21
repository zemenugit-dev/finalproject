import pool from './src/config/database';
async function main() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'app'
        AND table_name = 'farmers_profile'
      ORDER BY ordinal_position
    `);
    console.table(result.rows);
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
}
main();
