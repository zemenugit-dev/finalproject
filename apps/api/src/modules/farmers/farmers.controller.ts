
import type { Request, Response } from 'express';

import {
  listFarmers,
  findFarmerById,
  registerFarmerProfile
} from './farmers.service';

import {
  farmerIdSchema,
  createFarmerSchema
} from './farmers.schema';

export async function getFarmers(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const farmers = await listFarmers();
    res.status(200).json({
      success: true,
      count: farmers.length,
      data: farmers
    });
  } catch (error) {
    console.error('Failed to retrieve farmers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve farmers'
    });
  }
}

export async function getFarmerById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const validation = farmerIdSchema.safeParse({
      id: req.params.id
    });

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid farmer ID'
      });
      return;
    }

    const farmer = await findFarmerById(validation.data.id);

    if (!farmer) {
      res.status(404).json({
        success: false,
        message: 'Farmer profile not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: farmer
    });
  } catch (error) {
    console.error('Failed to retrieve farmer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve farmer'
    });
  }
}

export async function createFarmer(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const validation = createFarmerSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: 'Invalid farmer profile data',
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
      return;
    }

    const farmer = await registerFarmerProfile(validation.data);

    res.status(201).json({
      success: true,
      message: 'Farmer profile created successfully',
      data: farmer
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'A farmer profile already exists for this user'
    ) {
      res.status(409).json({
        success: false,
        message: error.message
      });
      return;
    }

    if (
      error instanceof Error &&
      error.message === 'A valid user ID is required'
    ) {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }

    if (
      error instanceof Error &&
      'code' in error &&
      error.code === '23503'
    ) {
      res.status(400).json({
        success: false,
        message: 'The specified user does not exist'
      });
      return;
    }

    console.error('Failed to create farmer profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create farmer profile'
    });
  }
}

