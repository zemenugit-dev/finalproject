
import pool from '../../config/database';
import { getPagination } from '../../utils/pagination';

export class ProductRepository {
    async findAll(pageValue?: unknown, limitValue?: unknown) {
        const { page, limit, offset } = getPagination(
            pageValue,
            limitValue
        );

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM app.products;
        `;

        const productsQuery = `
            SELECT
                p.product_id,
                p.name,
                p.unit,
                p.price_per_unit,
                p.created_at,
                c.name AS category_name,
                p.farmer_id
            FROM app.products p
            LEFT JOIN app.product_categories c
                ON p.category_id = c.category_id
            ORDER BY p.created_at DESC, p.product_id ASC
            LIMIT $1 OFFSET $2;
        `;

        const [countResult, productsResult] = await Promise.all([
            pool.query(countQuery),
            pool.query(productsQuery, [limit, offset])
        ]);

        const total = Number(countResult.rows[0].total);

        return {
            data: productsResult.rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPreviousPage: page > 1
            }
        };
    }

    async create(productData: {
        category_id: number;
        farmer_id: number;
        name: string;
        unit: string;
        price_per_unit: number;
    }) {
        const {
            category_id,
            farmer_id,
            name,
            unit,
            price_per_unit
        } = productData;

        const query = `
            INSERT INTO app.products
                (category_id, farmer_id, name, unit, price_per_unit)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        const values = [
            category_id,
            farmer_id,
            name,
            unit,
            price_per_unit
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }
}
