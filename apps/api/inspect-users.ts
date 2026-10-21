import pool from './src/config/database';
async function main() {
  try {
    const result = await pool.query(`
      SELECT
        u.user_id,
        u.full_name,
        u.phone_number,
        u.email,
        r.name AS role_name,
        u.is_verified
      FROM app.users u
      LEFT JOIN app.roles r ON r.role_id = u.role_id
      ORDER BY u.user_id
    `);
    console.table(result.rows);
    console.log('Total users:', result.rowCount);
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
}
main();
