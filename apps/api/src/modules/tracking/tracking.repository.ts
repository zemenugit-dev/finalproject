
import pool from '../../config/database';
import {
  CreateTrackingLogInput,
  TrackingLog,
  TrackedOrder
} from './tracking.schema';

export class TrackingRepository {
  async findOrderById(
    orderId: number
  ): Promise<TrackedOrder | null> {
    const result = await pool.query<TrackedOrder>(
      `
        SELECT
          order_id,
          buyer_id,
          product_id,
          quantity,
          total_price,
          status,
          created_at
        FROM app.supply_orders
        WHERE order_id = $1
        LIMIT 1
      `,
      [orderId]
    );

    return result.rows[0] ?? null;
  }

  async createTrackingLog(
    input: CreateTrackingLogInput
  ): Promise<TrackingLog> {
    const result = await pool.query<TrackingLog>(
      `
        INSERT INTO app.order_tracking_logs (
          order_id,
          location_details
        )
        VALUES ($1, $2)
        RETURNING
          log_id,
          order_id,
          location_details,
          logged_at
      `,
      [input.orderId, input.locationDetails]
    );

    return result.rows[0];
  }

  async findTrackingHistory(
    orderId: number
  ): Promise<TrackingLog[]> {
    const result = await pool.query<TrackingLog>(
      `
        SELECT
          log_id,
          order_id,
          location_details,
          logged_at
        FROM app.order_tracking_logs
        WHERE order_id = $1
        ORDER BY logged_at DESC, log_id DESC
      `,
      [orderId]
    );

    return result.rows;
  }
}
