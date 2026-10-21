import { z } from 'zod';

export const orderIdSchema = z.coerce
  .number()
  .int()
  .positive()
  .safe();

export const orderListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  status: z.string().trim().min(1).max(50).optional(),
});

export const createOrderSchema = z.object({
  buyer_id: z.coerce.number().int().positive().safe(),
  product_id: z.coerce.number().int().positive().safe(),
  quantity: z.coerce.number().finite().positive(),
  total_price: z.coerce.number().finite().nonnegative(),
  status: z.string().trim().min(1).max(50).default('pending'),
});

export const updateOrderSchema = z
  .object({
    buyer_id: z.coerce.number().int().positive().safe().optional(),
    product_id: z.coerce.number().int().positive().safe().optional(),
    quantity: z.coerce.number().finite().positive().optional(),
    total_price: z.coerce.number().finite().nonnegative().optional(),
    status: z.string().trim().min(1).max(50).optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: 'Provide at least one field to update.' },
  );

export type OrderId = z.infer<typeof orderIdSchema>;
export type OrderListQuery = z.infer<typeof orderListQuerySchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
