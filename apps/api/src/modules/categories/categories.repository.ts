import pool from '../../config/database';

export const createCategoryData = async (name: string, description: string) => {
    const result = await pool.query(
        `INSERT INTO app.product_categories (name, description) VALUES ($1, $2) RETURNING *`,
        [name, description]
    );
    return result.rows[0];
};

export const findAllCategories = async () => {
    const result = await pool.query('SELECT * FROM app.product_categories');
    return result.rows;
};
