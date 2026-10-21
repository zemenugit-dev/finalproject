import pool from '../../config/database';
import { ForecastQuery } from './forecasts.schema';
export class ForecastsRepository {
    async findCurrentPrices(filters: ForecastQuery) {
        const query = `
            WITH latest_prices AS (
                SELECT DISTINCT ON (mp.product_id, mp.market_id)
                    mp.price_id,
                    mp.product_id,
                    p.name AS product_name,
                    mp.market_id,
                    rm.market_name,
                    mp.current_price,
                    mp.updated_at
                FROM app.market_prices mp
                JOIN app.products p
                    ON p.product_id = mp.product_id
                JOIN app.regions_and_markets rm
                    ON rm.market_id = mp.market_id
                WHERE mp.current_price IS NOT NULL
                ORDER BY
                    mp.product_id,
                    mp.market_id,
                    mp.updated_at DESC NULLS LAST,
                    mp.price_id DESC
            )
            SELECT
                lp.product_id,
                lp.product_name,
                lp.market_id,
                lp.market_name,
                lp.current_price,
                lp.updated_at,
                (
                    SELECT COUNT(*)
                    FROM app.market_price_history mph
                    WHERE mph.product_id = lp.product_id
                      AND mph.market_id = lp.market_id
                ) AS history_count,
                (
                    SELECT COALESCE(
                        JSON_AGG(
                            JSON_BUILD_OBJECT(
                                'price', mph.price,
                                'recorded_at', mph.recorded_at
                            )
                            ORDER BY mph.recorded_at ASC, mph.history_id ASC
                        ),
                        '[]'::json
                    )
                    FROM app.market_price_history mph
                    WHERE mph.product_id = lp.product_id
                      AND mph.market_id = lp.market_id
                ) AS historical_observations
            FROM latest_prices lp
            WHERE ($1::bigint IS NULL OR lp.product_id = $1)
              AND ($2::bigint IS NULL OR lp.market_id = $2)
            ORDER BY lp.updated_at DESC NULLS LAST;
        `;
        const values = [
            filters.product_id ?? null,
            filters.market_id ?? null,
        ];
        const result = await pool.query(query, values);
        return result.rows;
    }
}

