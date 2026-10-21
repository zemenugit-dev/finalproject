require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'sasm_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD
});
async function main() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS app.inspections (
                inspection_id BIGSERIAL PRIMARY KEY,
                product_id BIGINT NOT NULL
                    REFERENCES app.products(product_id),
                market_id BIGINT NOT NULL
                    REFERENCES app.regions_and_markets(market_id),
                inspector_name VARCHAR(150) NOT NULL,
                sample_quantity NUMERIC(14, 2) NOT NULL
                    CHECK (sample_quantity > 0),
                quality_grade VARCHAR(10) NOT NULL
                    CHECK (quality_grade IN ('A', 'B', 'C', 'rejected')),
                status VARCHAR(20) NOT NULL
                    CHECK (status IN ('passed', 'failed', 'needs_review')),
                notes TEXT,
                inspected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            CREATE INDEX IF NOT EXISTS idx_inspections_product_market
                ON app.inspections(product_id, market_id);
            CREATE INDEX IF NOT EXISTS idx_inspections_status
                ON app.inspections(status);
            CREATE INDEX IF NOT EXISTS idx_inspections_inspected_at
                ON app.inspections(inspected_at DESC);
        `);
        console.log('Inspections table and indexes are ready.');
    } catch (error) {
        console.error('Migration failed:', error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}
main();

