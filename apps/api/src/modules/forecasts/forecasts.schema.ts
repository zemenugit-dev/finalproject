
import { z } from 'zod';

export const forecastQuerySchema = z.object({
    product_id: z.coerce.number().int().positive().optional(),
    market_id: z.coerce.number().int().positive().optional(),
    days: z.coerce.number().int().min(1).max(30).default(7),
});

export type ForecastQuery = z.infer<typeof forecastQuerySchema>;

