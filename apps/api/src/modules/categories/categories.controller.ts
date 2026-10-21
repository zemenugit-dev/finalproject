import { Request, Response } from 'express';
import { createCategoryData, findAllCategories } from './categories.repository';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await findAllCategories();
        res.status(200).json({ success: true, count: categories.length, data: categories });
    } catch (error: any) {
        res.status(500).json({ success:false, error: error.message });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description } = req.body;
        const newCategory = await createCategoryData(name, description);
        res.status(201).json({ success: true, data: newCategory });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
