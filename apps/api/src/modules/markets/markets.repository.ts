import pool from '../../config/database';
import { CreateMarketInput } from './markets.schema';
export class MarketsRepository {
    async findAll() {
        const query = `
            SELECT *
            FROM app.market_prices
            ORDER BY price_id DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    }
    async create(input: CreateMarketInput) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const query = `
                INSERT INTO app.market_prices
                    (product_id, market_id, current_price)
                VALUES ($1, $2, $3)
                RETURNING *;
            `;
            const values = [
                input.product_id,
                input.market_id,
                input.current_price,
            ];
            const result = await client.query(query, values);
            const marketPrice = result.rows[0];
            await client.query(
                `
                    INSERT INTO app.market_price_history
                        (product_id, market_id, price, recorded_at)
                    VALUES ($1, $2, $3, NOW());
                `,
                [
                    marketPrice.product_id,
                    marketPrice.market_id,
                    marketPrice.current_price,
                ]
            );
            await client.query('COMMIT');
            return marketPrice;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

