
import { ReportsRepository } from './reports.repository';
import {
  ReportDateFilter
} from './reports.schema';

export class ReportsService {
  private readonly repository: ReportsRepository;

  constructor() {
    this.repository = new ReportsRepository();
  }

  async getOrderSummary(filter: ReportDateFilter) {
    return this.repository.getOrderSummary(filter);
  }

  async getMarketPriceReport() {
    return this.repository.getMarketPriceReport();
  }

  async getInspectionSummary(filter: ReportDateFilter) {
    return this.repository.getInspectionSummary(filter);
  }
}
