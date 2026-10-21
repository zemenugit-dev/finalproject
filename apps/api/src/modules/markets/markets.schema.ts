import { z } from 'zod';

export const createMarketSchema = z.object({
    name: z.string({
        message: "Market name is required",
    }),
    region: z.string({
        message: "Region is required",
    }),
    description: z.string().optional(),
});

export interface CreateMarketInput {
    product_id: number;
    market_id: number;
    current_price: number;
}
