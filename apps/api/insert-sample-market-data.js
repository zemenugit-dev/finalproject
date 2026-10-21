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
    await client.query('BEGIN');
    const marketResult = await client.query(`
      INSERT INTO app.regions_and_markets (region_name, market_name)
      VALUES ('Amhara', 'Injibara Market')
      RETURNING market_id;
    `);
    const marketId = marketResult.rows[0].market_id;
    const products = [
      ['Teff', 'KG', 180],
      ['Maize', 'KG', 45],
      ['Wheat', 'KG', 65]
    ];
    for (const [name, unit, price] of products) {
      const productResult = await client.query(`
        INSERT INTO app.products (name, unit, price_per_unit)
        VALUES ($1, $2, $3)
        RETURNING product_id;
      `, [name, unit, price]);
      const productId = productResult.rows[0].product_id;
      await client.query(`
        INSERT INTO app.market_prices
          (product_id, market_id, current_price)
        VALUES ($1, $2, $3);
      `, [productId, marketId, price]);
    }
    await client.query('COMMIT');
    console.log('Success! Sample products, market, and prices inserted.');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Database error:', error.message);
  } finally {
    await client.end().catch(() => {});
  }
}
main();
