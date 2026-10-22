
import pool from '../../config/database';
import {
  OrderSummaryReport,
  MarketPriceReport,
  InspectionSummaryReport,
  ReportDateFilter
} from './reports.schema';

export class ReportsRepository {
  async getOrderSummary(
    filter: ReportDateFilter
  ): Promise<OrderSummaryReport> {
    const result = await pool.query<OrderSummaryReport>(
      `
        SELECT
          COUNT(*)::int AS total_orders,
          COALESCE(SUM(total_price), 0)::text AS total_order_value,
          COUNT(*) FILTER (
            WHERE LOWER(status) = 'pending'
          )::int AS pending_orders,
          COUNT(*) FILTER (
            WHERE LOWER(status) = 'confirmed'
          )::int AS confirmed_orders,
          COUNT(*) FILTER (
            WHERE LOWER(status) IN ('completed', 'delivered')
          )::int AS completed_orders,
          COUNT(*) FILTER (
            WHERE LOWER(status) = 'cancelled'
          )::int AS cancelled_orders
        FROM app.supply_orders
        WHERE ($1::date IS NULL OR created_at >= $1::date)
          AND (
            $2::date IS NULL
            OR created_at < ($2::date + INTERVAL '1 day')
          )
      `,
      [filter.startDate ?? null, filter.endDate ?? null]
    );

    return result.rows[0];
  }

  async getMarketPriceReport(): Promise<MarketPriceReport[]> {
    const result = await pool.query<MarketPriceReport>(
      `
        SELECT
          p.product_id,
          p.name AS product_name,
          mp.market_id,
          mp.current_price::text AS current_price,
          mp.updated_at
        FROM app.market_prices mp
        INNER JOIN app.products p
          ON p.product_id = mp.product_id
        ORDER BY p.name, mp.market_id
      `
    );

    return result.rows;
  }

  async getInspectionSummary(
    filter: ReportDateFilter
  ): Promise<InspectionSummaryReport> {
    const result = await pool.query<InspectionSummaryReport>(
      `
        SELECT
          COUNT(*)::int AS total_inspections,
          COUNT(*) FILTER (
            WHERE LOWER(status) IN ('passed', 'approved')
          )::int AS passed_inspections,
          COUNT(*) FILTER (
            WHERE LOWER(status) IN ('failed', 'rejected')
          )::int AS failed_inspections,
          COUNT(*) FILTER (
            WHERE LOWER(status) IN ('pending', 'in_progress')
          )::int AS pending_inspections
        FROM app.inspections
        WHERE ($1::date IS NULL OR inspected_at >= $1::date)
          AND (
            $2::date IS NULL
            OR inspected_at < ($2::date + INTERVAL '1 day')
          )
      `,
      [filter.startDate ?? null, filter.endDate ?? null]
    );

    return result.rows[0];
  }
}
