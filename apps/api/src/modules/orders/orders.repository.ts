import pool from '../../config/database';
import type {
  OrderListQuery,
  CreateOrderInput,
  UpdateOrderInput,
} from './orders.schema';

export interface OrderRecord {
  order_id: number;
  buyer_id: number;
  product_id: number;
  quantity: string | number;
  total_price: string | number;
  status: string;
  created_at: Date | string;
}

const orderColumns = `
  order_id,
  buyer_id,
  product_id,
  quantity,
  total_price,
  status,
  created_at
`;

export async function findAll(
  filters: OrderListQuery,
): Promise<OrderRecord[]> {
  const values: unknown[] = [];
  const conditions: string[] = [];

  if (filters.status !== undefined) {
    values.push(filters.status);
    conditions.push(`status = $${values.length}`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  values.push(filters.limit);
  const limitPlaceholder = `$${values.length}`;

  values.push(filters.offset);
  const offsetPlaceholder = `$${values.length}`;

  const result = await pool.query<OrderRecord>(
    `
      SELECT ${orderColumns}
      FROM app.supply_orders
      ${whereClause}
      ORDER BY order_id DESC
      LIMIT ${limitPlaceholder}
      OFFSET ${offsetPlaceholder}
    `,
    values,
  );

  return result.rows;
}

export async function findById(
  id: number,
): Promise<OrderRecord | null> {
  const result = await pool.query<OrderRecord>(
    `
      SELECT ${orderColumns}
      FROM app.supply_orders
      WHERE order_id = $1
      LIMIT 1
    `,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function create(
  input: CreateOrderInput,
): Promise<OrderRecord> {
  const result = await pool.query<OrderRecord>(
    `
      INSERT INTO app.supply_orders (
        buyer_id,
        product_id,
        quantity,
        total_price,
        status
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING ${orderColumns}
    `,
    [
      input.buyer_id,
      input.product_id,
      input.quantity,
      input.total_price,
      input.status,
    ],
  );

  return result.rows[0];
}

export async function update(
  id: number,
  input: UpdateOrderInput,
): Promise<OrderRecord | null> {
  const allowedColumns: Record<string, string> = {
    buyer_id: 'buyer_id',
    product_id: 'product_id',
    quantity: 'quantity',
    total_price: 'total_price',
    status: 'status',
  };

  const values: unknown[] = [];
  const assignments: string[] = [];

  for (const [key, value] of Object.entries(input)) {
    const column = allowedColumns[key];

    if (!column || value === undefined) {
      continue;
    }

    values.push(value);
    assignments.push(`${column} = $${values.length}`);
  }

  if (assignments.length === 0) {
    return findById(id);
  }

  values.push(id);

  const result = await pool.query<OrderRecord>(
    `
      UPDATE app.supply_orders
      SET ${assignments.join(', ')}
      WHERE order_id = $${values.length}
      RETURNING ${orderColumns}
    `,
    values,
  );

  return result.rows[0] ?? null;
}

export async function remove(id: number): Promise<boolean> {
  const result = await pool.query(
    `
      DELETE FROM app.supply_orders
      WHERE order_id = $1
      RETURNING order_id
    `,
    [id],
  );

  return (result.rowCount ?? 0) > 0;
}
