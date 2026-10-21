
import { z } from 'zod';

export const registerSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, 'Full name must contain at least 2 characters')
    .max(150, 'Full name must not exceed 150 characters'),

  phone_number: z
    .string()
    .trim()
    .min(7, 'Enter a valid phone number')
    .max(20, 'Phone number must not exceed 20 characters')
    .regex(/^[+\d][\d\s()-]*$/, 'Enter a valid phone number'),

  email: z
    .string()
    .trim()
    .email('Enter a valid email address')
    .max(254)
    .optional()
    .or(z.literal('')),

  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters')
    .max(128, 'Password must not exceed 128 characters'),

  role_name: z.enum(['Farmer', 'Buyer', 'Transporter'])
});

export const loginSchema = z.object({
  phone_number: z
    .string()
    .trim()
    .min(7, 'Enter a valid phone number')
    .max(20, 'Invalid phone number'),

  password: z
    .string()
    .min(1, 'Password is required')
    .max(128, 'Password must not exceed 128 characters')
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

