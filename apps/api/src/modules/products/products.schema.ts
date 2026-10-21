import { z } from 'zod';

// á‹¨ Product áˆ¬áŒ…áˆµá‰µáˆ¬áˆ½áŠ• áˆµáŠªáˆ›
export const createProductSchema = z.object({
    name: z.string({
        message: "Product name is required",
    }),
    description: z.string().optional(),
    price: z.number({
        message: "Price is required and must be a number",
    }),
    stock_quantity: z.number().optional(),
    category_id: z.number({
        message: "Category ID is required",
    }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
