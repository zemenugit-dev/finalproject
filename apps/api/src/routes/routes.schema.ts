
import { z } from 'zod';

const routeStatusSchema = z.enum([
  'Planned',
  'Assigned',
  'In Transit',
  'Completed',
  'Cancelled'
]);

export const createRouteSchema = z.object({
  body: z.object({
    order_id: z.number().int().positive().optional().nullable(),

    transporter_id: z.number().int().positive().optional().nullable(),

    start_location: z
      .string()
      .trim()
      .min(1, 'Start location is required')
      .max(500),

    destination: z
      .string()
      .trim()
      .min(1, 'Destination is required')
      .max(500),

    distance_km: z.number().positive().max(100000).optional().nullable(),

    estimated_duration_minutes: z
      .number()
      .int()
      .positive()
      .max(525600)
      .optional()
      .nullable(),

    status: routeStatusSchema.optional(),

    departure_time: z.string().datetime({ offset: true }).optional().nullable(),

    arrival_time: z.string().datetime({ offset: true }).optional().nullable()
  })
});

export const updateRouteSchema = z.object({
  params: z.object({
    routeId: z.coerce.number().int().positive()
  }),

  body: z.object({
    order_id: z.number().int().positive().optional().nullable(),

    transporter_id: z.number().int().positive().optional().nullable(),

    start_location: z
      .string()
      .trim()
      .min(1)
      .max(500)
      .optional(),

    destination: z
      .string()
      .trim()
      .min(1)
      .max(500)
      .optional(),

    distance_km: z.number().positive().max(100000).optional().nullable(),

    estimated_duration_minutes: z
      .number()
      .int()
      .positive()
      .max(525600)
      .optional()
      .nullable(),

    status: routeStatusSchema.optional(),

    departure_time: z.string().datetime({ offset: true }).optional().nullable(),

    arrival_time: z.string().datetime({ offset: true }).optional().nullable()
  }).refine(
    (body) => Object.keys(body).length > 0,
    { message: 'At least one field must be provided for update' }
  )
});

export const routeIdSchema = z.object({
  params: z.object({
    routeId: z.coerce.number().int().positive()
  })
});

export const listRoutesSchema = z.object({
  query: z.object({
    status: routeStatusSchema.optional(),
    transporter_id: z.coerce.number().int().positive().optional(),
    order_id: z.coerce.number().int().positive().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20)
  })
});

export type CreateRouteInput = z.infer<typeof createRouteSchema>['body'];
export type UpdateRouteInput = z.infer<typeof updateRouteSchema>['body'];
export type RouteIdInput = z.infer<typeof routeIdSchema>['params'];
export type ListRoutesQuery = z.infer<typeof listRoutesSchema>['query'];
