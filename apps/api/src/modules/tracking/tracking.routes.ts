
import { Router } from 'express';
import { TrackingController } from './tracking.controller';

const router = Router();
const trackingController = new TrackingController();

// Record a tracking update
router.post(
  '/',
  trackingController.createTrackingUpdate
);

// Get order details and tracking history
router.get(
  '/:orderId',
  trackingController.getTrackingHistory
);

export default router;
