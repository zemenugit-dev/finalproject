
import pool from '../config/database';import type {
  CreateRouteInput,
  UpdateRouteInput,
  ListRoutesQuery
} from './routes.schema';

export interface RouteRecord {
  route_id: string;
  order_id: string | null;
  transporter_id: string | null;
  start_location: string;
  destination: string;
  distance_km: string | null;
  estimated_duration_minutes: number | null;
  status: string;
  departure_time: Date | null;
  arrival_time: Date | null;
  created_at: Date;
  updated_at: Date;
}

export async function createRoute(
  input: CreateRouteInput
): Promise<RouteRecord> {
  const query = `
    INSERT INTO app.delivery_routes (
      order_id,
      transporter_id,
      start_location,
      destination,
      distance_km,
      estimated_duration_minutes,
      status,
      departure_time,
      arrival_time
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;

  const values = [
    input.order_id ?? null,
    input.transporter_id ?? null,
    input.start_location,
    input.destination,
    input.distance_km ?? null,
    input.estimated_duration_minutes ?? null,
    input.status ?? 'Planned',
    input.departure_time ?? null,
    input.arrival_time ?? null
  ];

  const result = await pool.query<RouteRecord>(query, values);
  return result.rows[0];
}

export async function findAllRoutes(
  filters: ListRoutesQuery
): Promise<{ data: RouteRecord[]; total: number }> {
  const conditions: string[] = [];
  const values: unknown[] = [];

  if (filters.status) {
    values.push(filters.status);
    conditions.push(`status = $${values.length}`);
  }

  if (filters.transporter_id !== undefined) {
    values.push(filters.transporter_id);
    conditions.push(`transporter_id = $${values.length}`);
  }

  if (filters.order_id !== undefined) {
    values.push(filters.order_id);
    conditions.push(`order_id = $${values.length}`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  const countResult = await pool.query<{ count: string }>(
    `SELECT COUNT(*) AS count FROM app.delivery_routes ${whereClause}`,
    values
  );

  const total = Number(countResult.rows[0].count);
  const offset = (filters.page - 1) * filters.limit;

  values.push(filters.limit);
  const limitPlaceholder = `$${values.length}`;

  values.push(offset);
  const offsetPlaceholder = `$${values.length}`;

  const result = await pool.query<RouteRecord>(
    `
      SELECT *
      FROM app.delivery_routes
      ${whereClause}
      ORDER BY created_at DESC, route_id DESC
      LIMIT ${limitPlaceholder}
      OFFSET ${offsetPlaceholder}
    `,
    values
  );

  return { data: result.rows, total };
}

export async function findRouteById(
  routeId: number
): Promise<RouteRecord | null> {
  const result = await pool.query<RouteRecord>(
    'SELECT * FROM app.delivery_routes WHERE route_id = $1',
    [routeId]
  );

  return result.rows[0] ?? null;
}

export async function updateRoute(
  routeId: number,
  input: UpdateRouteInput
): Promise<RouteRecord | null> {
  const entries = Object.entries(input).filter(
    ([, value]) => value !== undefined
  );

  if (entries.length === 0) {
    return findRouteById(routeId);
  }

  const allowedColumns = new Set([
    'order_id',
    'transporter_id',
    'start_location',
    'destination',
    'distance_km',
    'estimated_duration_minutes',
    'status',
    'departure_time',
    'arrival_time'
  ]);

  const values: unknown[] = [];
  const assignments: string[] = [];

  for (const [column, value] of entries) {
    if (!allowedColumns.has(column)) continue;

    values.push(value);
    assignments.push(`${column} = $${values.length}`);
  }

  if (assignments.length === 0) {
    return findRouteById(routeId);
  }

  assignments.push('updated_at = CURRENT_TIMESTAMP');
  values.push(routeId);

  const result = await pool.query<RouteRecord>(
    `
      UPDATE app.delivery_routes
      SET ${assignments.join(', ')}
      WHERE route_id = $${values.length}
      RETURNING *
    `,
    values
  );

  return result.rows[0] ?? null;
}

export async function deleteRoute(routeId: number): Promise<boolean> {
  const result = await pool.query(
    'DELETE FROM app.delivery_routes WHERE route_id = $1',
    [routeId]
  );

  return (result.rowCount ?? 0) > 0;
}
