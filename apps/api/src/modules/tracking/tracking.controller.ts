
import { Request, Response } from 'express';
import { TrackingService } from './tracking.service';
import { validateCreateTrackingLog } from './tracking.schema';

export class TrackingController {
  private readonly service: TrackingService;

  constructor() {
    this.service = new TrackingService();
  }

  createTrackingUpdate = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const input = validateCreateTrackingLog(req.body);

      if (!input) {
        res.status(400).json({
          success: false,
          message:
            'A valid orderId and locationDetails are required.'
        });
        return;
      }

      const tracking = await this.service.addTrackingUpdate(input);

      res.status(201).json({
        success: true,
        message: 'Tracking update recorded successfully.',
        data: tracking
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'ORDER_NOT_FOUND'
      ) {
        res.status(404).json({
          success: false,
          message: 'Supply order not found.'
        });
        return;
      }

      console.error('Create tracking update error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to record tracking update.'
      });
    }
  };

  getTrackingHistory = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const orderId = Number(req.params.orderId);

      if (!Number.isSafeInteger(orderId) || orderId <= 0) {
        res.status(400).json({
          success: false,
          message: 'A valid orderId is required.'
        });
        return;
      }

      const result = await this.service.getTrackingHistory(orderId);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'ORDER_NOT_FOUND'
      ) {
        res.status(404).json({
          success: false,
          message: 'Supply order not found.'
        });
        return;
      }

      console.error('Get tracking history error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to retrieve tracking history.'
      });
    }
  };
}
