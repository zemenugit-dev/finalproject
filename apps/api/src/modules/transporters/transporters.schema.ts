import { z } from 'zod';

export const createTransporterSchema = z.object({
  user_id: z.coerce.number().int().positive(),
  vehicle_type: z.string().min(1, 'Vehicle type is required'),
  license_plate: z.string().min(1, 'License plate is required'),
});

export type CreateTransporterInput = z.infer<
  typeof createTransporterSchema
>;
