
import { Request } from 'express';

export interface CreateTrackingLogInput {
  orderId: number;
  locationDetails: string;
}

export interface TrackingLog {
  log_id: string;
  order_id: string;
  location_details: string;
  logged_at: Date | string;
}

export interface TrackedOrder {
  order_id: string;
  buyer_id: string;
  product_id: string;
  quantity: string;
  total_price: string;
  status: string;
  created_at: Date | string;
}

export interface TrackingRequest extends Request {
  body: {
    orderId?: number | string;
    locationDetails?: string;
  };
}

export function validateCreateTrackingLog(
  body: unknown
): CreateTrackingLogInput | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const value = body as Record<string, unknown>;
  const orderId = Number(value.orderId);

  if (
    value.orderId === undefined ||
    value.orderId === null ||
    value.orderId === '' ||
    !Number.isSafeInteger(orderId) ||
    orderId <= 0
  ) {
    return null;
  }

  if (
    typeof value.locationDetails !== 'string' ||
    value.locationDetails.trim().length === 0 ||
    value.locationDetails.trim().length > 1000
  ) {
    return null;
  }

  return {
    orderId,
    locationDetails: value.locationDetails.trim()
  };
}
