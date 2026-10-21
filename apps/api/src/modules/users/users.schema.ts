import { z } from 'zod';

export const userIdSchema = z.coerce
  .number()
  .int()
  .positive();

export const userListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const updateUserSchema = z
  .object({
    full_name: z.string().trim().min(2).max(150).optional(),

    phone_number: z.string().trim().min(5).max(30).optional(),

    email: z
      .union([
        z.string().trim().email().max(254),
        z.literal(''),
        z.null(),
      ])
      .optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: 'Provide at least one field to update.',
    },
  );

export type UserId = z.infer<typeof userIdSchema>;
export type UserListQuery = z.infer<typeof userListQuerySchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
