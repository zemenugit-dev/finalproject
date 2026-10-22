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
    for (const table of ['supply_orders', 'inspections']) {
      const result = await client.query(
        `SELECT DISTINCT status FROM app.${table} ORDER BY status`
      );
      console.log(`\n${table} status values:`);
      console.table(result.rows);
    }
  } catch (error) {
    console.error(error.message);
  } finally {
    await client.end();
  }
}
main();
