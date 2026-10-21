import { z } from 'zod';

const qualityGradeSchema = z.enum([
  'A',
  'B',
  'C',
  'rejected',
]);

const inspectionStatusSchema = z.enum([
  'passed',
  'failed',
  'needs_review',
]);

export const inspectionIdSchema = z.coerce
  .number()
  .int()
  .positive();

export const createInspectionSchema = z.object({
  product_id: z.coerce.number().int().positive(),
  market_id: z.coerce.number().int().positive(),

  inspector_name: z.string().trim().min(2).max(150),

  sample_quantity: z.coerce.number().positive(),

  quality_grade: qualityGradeSchema,
  status: inspectionStatusSchema,

  notes: z.string().trim().max(5000).nullable().optional(),

  inspected_at: z.string().datetime({ offset: true }).optional(),
});

export const updateInspectionSchema =
  createInspectionSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    { message: 'Provide at least one field to update.' },
  );

export const inspectionQuerySchema = z.object({
  product_id: z.coerce.number().int().positive().optional(),
  market_id: z.coerce.number().int().positive().optional(),
  quality_grade: qualityGradeSchema.optional(),
  status: inspectionStatusSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});
