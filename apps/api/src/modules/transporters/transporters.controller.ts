import { Request, Response } from 'express';
import * as service from './transporters.service';
import { createTransporterSchema } from './transporters.schema';

export async function getTransporters(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const transporters = await service.getTransporters();

    res.status(200).json({
      success: true,
      data: transporters,
    });
  } catch (error) {
    console.error('Get transporters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve transporters',
    });
  }
}

export async function getTransporterById(
  req: Request,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      success: false,
      message: 'Invalid transporter ID',
    });
    return;
  }

  try {
    const transporter = await service.getTransporter(id);

    if (!transporter) {
      res.status(404).json({
        success: false,
        message: 'Transporter not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: transporter,
    });
  } catch (error) {
    console.error('Get transporter error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve transporter',
    });
  }
}

export async function createTransporter(
  req: Request,
  res: Response
): Promise<void> {
  const validation = createTransporterSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid transporter data',
      errors: validation.error.flatten(),
    });
    return;
  }

  try {
    const transporter = await service.registerTransporter(validation.data);

    res.status(201).json({
      success: true,
      message: 'Transporter registered successfully',
      data: transporter,
    });
  } catch (error) {
    console.error('Create transporter error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register transporter',
    });
  }
}
