
import { z } from 'zod';

export const farmerIdSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const createFarmerSchema = z.object({
  user_id: z.coerce.number().int().positive(),
  farm_location: z
    .string()
    .trim()
    .max(500, 'Farm location must not exceed 500 characters')
    .nullable()
    .optional(),
  farm_size: z.coerce.number()
    .finite()
    .nonnegative()
    .nullable()
    .optional()
});

export type CreateFarmerRequest = z.infer<typeof createFarmerSchema>;

