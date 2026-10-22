
import { Router } from 'express';
import { ReportsController } from './reports.controller';

const router = Router();
const reportsController = new ReportsController();

// GET /api/reports/orders
router.get(
  '/orders',
  reportsController.getOrderSummary
);

// GET /api/reports/market-prices
router.get(
  '/market-prices',
  reportsController.getMarketPriceReport
);

// GET /api/reports/inspections
router.get(
  '/inspections',
  reportsController.getInspectionSummary
);

export default router;
