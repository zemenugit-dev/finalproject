
import { Request, Response } from 'express';
import { ReportsService } from './reports.service';
import { validateReportDateFilter } from './reports.schema';

export class ReportsController {
  private readonly service: ReportsService;

  constructor() {
    this.service = new ReportsService();
  }

  getOrderSummary = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const filter = validateReportDateFilter(req.query);

      if (!filter) {
        res.status(400).json({
          success: false,
          message: 'Invalid startDate or endDate. Use YYYY-MM-DD.'
        });
        return;
      }

      const data = await this.service.getOrderSummary(filter);

      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Order summary report error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to retrieve order summary report.'
      });
    }
  };

  getMarketPriceReport = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const data = await this.service.getMarketPriceReport();

      res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (error) {
      console.error('Market price report error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to retrieve market price report.'
      });
    }
  };

  getInspectionSummary = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const filter = validateReportDateFilter(req.query);

      if (!filter) {
        res.status(400).json({
          success: false,
          message: 'Invalid startDate or endDate. Use YYYY-MM-DD.'
        });
        return;
      }

      const data = await this.service.getInspectionSummary(filter);

      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Inspection summary report error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to retrieve inspection summary report.'
      });
    }
  };
}
