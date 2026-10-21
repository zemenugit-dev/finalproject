import { Request, Response } from 'express';
import pool from '../../config/database'; // áŠ¨áˆ¨áŒ¢á‰± á‹áŒª á‹ˆá‹³áˆˆá‹ config áˆˆáˆ˜áŒá‰£á‰µ

// áˆáˆ‰áŠ•áˆ áˆáˆ­á‰¶á‰½ áŠ¨á‹³á‰³á‰¤á‹ áˆ›áˆáŒ£á‰µ (GET)
export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const query = `
            SELECT p.product_id, p.name, p.unit, p.price_per_unit, p.created_at,
                   c.name AS category_name, p.farmer_id
            FROM app.products p
            LEFT JOIN app.product_categories c ON p.category_id = c.category_id
            ORDER BY p.created_at DESC;
        `;
        const result = await pool.query(query);
        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ success: false, error: err.message });
        } else {
            res.status(500).json({ success: false, error: 'Unknown server error' });
        }
    }
};

// áŠ á‹²áˆµ áˆáˆ­á‰µ áˆ˜áˆ˜á‹áŒˆá‰¥ (POST)
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { category_id, farmer_id, name, unit, price_per_unit } = req.body;

        const query = `
            INSERT INTO app.products (category_id, farmer_id, name, unit, price_per_unit)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [category_id, farmer_id, name, unit, price_per_unit];
        const result = await pool.query(query, values);

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: result.rows[0]
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ success: false, error: err.message });
        } else {
            res.status(500).json({ success: false, error: 'Unknown server error' });
        }
    }
};
