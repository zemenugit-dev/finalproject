import { z } from 'zod';

// á‹¨ Category áˆ¬áŒ…áˆµá‰µáˆ¬áˆ½áŠ• áˆµáŠªáˆ›
export const createCategorySchema = z.object({
    name: z.string({
        message: "Category name is required",
    }),
    description: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
