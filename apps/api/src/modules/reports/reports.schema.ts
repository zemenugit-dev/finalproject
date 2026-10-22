
export interface OrderSummaryReport {
  total_orders: number;
  total_order_value: string;
  pending_orders: number;
  confirmed_orders: number;
  completed_orders: number;
  cancelled_orders: number;
}

export interface MarketPriceReport {
  product_id: string;
  product_name: string;
  market_id: string;
  current_price: string;
  updated_at: Date | string;
}

export interface InspectionSummaryReport {
  total_inspections: number;
  passed_inspections: number;
  failed_inspections: number;
  pending_inspections: number;
}

export interface ReportDateFilter {
  startDate?: string;
  endDate?: string;
}

export function validateReportDateFilter(
  query: unknown
): ReportDateFilter | null {
  if (!query || typeof query !== 'object') {
    return null;
  }

  const value = query as Record<string, unknown>;
  const startDate = value.startDate;
  const endDate = value.endDate;

  if (
    startDate !== undefined &&
    (typeof startDate !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
      Number.isNaN(Date.parse(`${startDate}T00:00:00Z`)))
  ) {
    return null;
  }

  if (
    endDate !== undefined &&
    (typeof endDate !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(endDate) ||
      Number.isNaN(Date.parse(`${endDate}T00:00:00Z`)))
  ) {
    return null;
  }

  if (
    typeof startDate === 'string' &&
    typeof endDate === 'string' &&
    startDate > endDate
  ) {
    return null;
  }

  return {
    startDate: startDate as string | undefined,
    endDate: endDate as string | undefined
  };
}
