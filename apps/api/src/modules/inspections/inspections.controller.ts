
import type { Request, Response } from 'express';

import {
  createInspectionSchema,
  inspectionIdSchema,
  inspectionQuerySchema,
  updateInspectionSchema,
} from './inspections.schema';

import * as service from './inspections.service';
import { InspectionNotFoundError } from './inspections.service';

/**
 * Handle errors returned by the inspection service or database.
 */
function handleError(error: unknown, res: Response): void {
  if (error instanceof InspectionNotFoundError) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
    return;
  }

  const databaseError = error as {
    code?: string;
    constraint?: string;
  } | null;

  if (
    databaseError?.code === '23503' ||
    databaseError?.code === '23514'
  ) {
    res.status(400).json({
      success: false,
      message:
        'The inspection references an invalid product or market, or contains a value not allowed by the database.',
      constraint: databaseError.constraint,
    });
    return;
  }

  if (databaseError?.code === '23502') {
    res.status(400).json({
      success: false,
      message: 'A required inspection field is missing.',
      constraint: databaseError.constraint,
    });
    return;
  }

  console.error('Inspection API error:', error);

  res.status(500).json({
    success: false,
    message:
      'An unexpected error occurred in the inspections module.',
  });
}

/**
 * Validate an inspection ID from the URL.
 *
 * Handles string and string-array parameter types.
 */
function parseId(
  rawId: string | string[],
  res: Response,
): number | null {
  const idValue = Array.isArray(rawId) ? rawId[0] : rawId;

  const result = inspectionIdSchema.safeParse(idValue);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: 'Inspection ID must be a positive integer.',
    });

    return null;
  }

  return result.data;
}

/**
 * GET /api/inspections
 * Get all inspections with optional filters and pagination.
 */
export async function listInspections(
  req: Request,
  res: Response,
): Promise<void> {
  const validation = inspectionQuerySchema.safeParse(req.query);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid inspection filters.',
      errors: validation.error.flatten(),
    });
    return;
  }

  try {
    const data = await service.getInspections(validation.data);

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
}

/**
 * GET /api/inspections/:id
 * Get one inspection by ID.
 */
export async function getInspection(
  req: Request,
  res: Response,
): Promise<void> {
  const rawId = req.params['id'];

  if (rawId === undefined) {
    res.status(400).json({
      success: false,
      message: 'Inspection ID is required.',
    });
    return;
  }

  const id = parseId(rawId, res);

  if (id === null) {
    return;
  }

  try {
    const data = await service.getInspectionById(id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
}

/**
 * POST /api/inspections
 * Create a new inspection.
 */
export async function createInspection(
  req: Request,
  res: Response,
): Promise<void> {
  const validation = createInspectionSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid inspection data.',
      errors: validation.error.flatten(),
    });
    return;
  }

  try {
    const data = await service.addInspection(validation.data);

    res.status(201).json({
      success: true,
      message: 'Inspection created successfully.',
      data,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
}

/**
 * PATCH /api/inspections/:id
 * Update selected fields of an inspection.
 */
export async function updateInspection(
  req: Request,
  res: Response,
): Promise<void> {
  const rawId = req.params['id'];

  if (rawId === undefined) {
    res.status(400).json({
      success: false,
      message: 'Inspection ID is required.',
    });
    return;
  }

  const id = parseId(rawId, res);

  if (id === null) {
    return;
  }

  const validation = updateInspectionSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid inspection update data.',
      errors: validation.error.flatten(),
    });
    return;
  }

  try {
    const data = await service.editInspection(id, validation.data);

    res.status(200).json({
      success: true,
      message: 'Inspection updated successfully.',
      data,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
}

/**
 * PUT /api/inspections/:id
 * Update an inspection using the same validated update behavior.
 */
export async function replaceInspection(
  req: Request,
  res: Response,
): Promise<void> {
  await updateInspection(req, res);
}

/**
 * DELETE /api/inspections/:id
 * Delete an inspection.
 */
export async function deleteInspection(
  req: Request,
  res: Response,
): Promise<void> {
  const rawId = req.params['id'];

  if (rawId === undefined) {
    res.status(400).json({
      success: false,
      message: 'Inspection ID is required.',
    });
    return;
  }

  const id = parseId(rawId, res);

  if (id === null) {
    return;
  }

  try {
    const data = await service.removeInspection(id);

    res.status(200).json({
      success: true,
      message: 'Inspection deleted successfully.',
      data,
    });
  } catch (error: unknown) {
    handleError(error, res);
  }
}

