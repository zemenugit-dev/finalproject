import pool from '../../config/database';
export class ProductRepository {
    async findAll() {
        const query = `
            SELECT p.product_id, p.name, p.unit, p.price_per_unit, p.created_at,
                   c.name AS category_name, p.farmer_id
            FROM app.products p
            LEFT JOIN app.product_categories c ON p.category_id = c.category_id
            ORDER BY p.created_at DESC;
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    async create(productData: { category_id: number; farmer_id: number; name: string; unit: string; price_per_unit: number }) {
        const { category_id, farmer_id, name, unit, price_per_unit } = productData;
        const query = `
            INSERT INTO app.products (category_id, farmer_id, name, unit, price_per_unit)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [category_id, farmer_id, name, unit, price_per_unit];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
}
