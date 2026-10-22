
import { Request, Response } from 'express';
import { ProductRepository } from './products.repository';

const productRepository = new ProductRepository();

export const getProducts = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const result = await productRepository.findAll(
            req.query.page,
            req.query.limit
        );

        res.status(200).json({
            success: true,
            count: result.data.length,
            data: result.data,
            pagination: result.pagination
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('Get products error:', err.message);
            res.status(500).json({
                success: false,
                error: 'Failed to retrieve products'
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Unknown server error'
            });
        }
    }
};

export const createProduct = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            category_id,
            farmer_id,
            name,
            unit,
            price_per_unit
        } = req.body;

        const product = await productRepository.create({
            category_id,
            farmer_id,
            name,
            unit,
            price_per_unit
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('Create product error:', err.message);
            res.status(500).json({
                success: false,
                error: 'Failed to create product'
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Unknown server error'
            });
        }
    }
};
