import pool from './src/config/database';
async function main() {
  try {
    const result = await pool.query(`
      SELECT role_id, name, description
      FROM app.roles
      ORDER BY role_id
    `);
    console.table(result.rows);
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
}
main();
