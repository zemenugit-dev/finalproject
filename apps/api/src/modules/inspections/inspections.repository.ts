import pool from '../../config/database';
import type {
  Inspection,
  InspectionFilters,
  CreateInspectionInput,
  UpdateInspectionInput,
} from './inspections.types';

export async function findAllInspections(
  filters: InspectionFilters,
): Promise<Inspection[]> {
  const conditions: string[] = [];
  const values: unknown[] = [];

  const addFilter = (column: string, value: unknown) => {
    values.push(value);
    conditions.push(`${column} = $${values.length}`);
  };

  if (filters.product_id !== undefined) {
    addFilter('i.product_id', filters.product_id);
  }

  if (filters.market_id !== undefined) {
    addFilter('i.market_id', filters.market_id);
  }

  if (filters.quality_grade !== undefined) {
    addFilter('i.quality_grade', filters.quality_grade);
  }

  if (filters.status !== undefined) {
    addFilter('i.status', filters.status);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  values.push(filters.limit);
  const limitParameter = `$${values.length}`;

  values.push(filters.offset);
  const offsetParameter = `$${values.length}`;

  const result = await pool.query<Inspection>(
    `
      SELECT
        i.inspection_id,
        i.product_id,
        i.market_id,
        i.inspector_name,
        i.sample_quantity,
        i.quality_grade,
        i.status,
        i.notes,
        i.inspected_at,
        i.created_at,
        i.updated_at
      FROM app.inspections i
      ${whereClause}
      ORDER BY i.inspected_at DESC, i.inspection_id DESC
      LIMIT ${limitParameter}
      OFFSET ${offsetParameter}
    `,
    values,
  );

  return result.rows;
}

export async function findInspectionById(
  id: number,
): Promise<Inspection | null> {
  const result = await pool.query<Inspection>(
    `
      SELECT *
      FROM app.inspections
      WHERE inspection_id = $1
    `,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function createInspection(
  input: CreateInspectionInput,
): Promise<Inspection> {
  const result = await pool.query<Inspection>(
    `
      INSERT INTO app.inspections (
        product_id,
        market_id,
        inspector_name,
        sample_quantity,
        quality_grade,
        status,
        notes,
        inspected_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        COALESCE($8::timestamptz, NOW())
      )
      RETURNING *
    `,
    [
      input.product_id,
      input.market_id,
      input.inspector_name,
      input.sample_quantity,
      input.quality_grade,
      input.status,
      input.notes ?? null,
      input.inspected_at ?? null,
    ],
  );

  return result.rows[0];
}

export async function updateInspection(
  id: number,
  input: UpdateInspectionInput,
): Promise<Inspection | null> {
  const columnMap: Record<string, string> = {
    product_id: 'product_id',
    market_id: 'market_id',
    inspector_name: 'inspector_name',
    sample_quantity: 'sample_quantity',
    quality_grade: 'quality_grade',
    status: 'status',
    notes: 'notes',
    inspected_at: 'inspected_at',
  };

  const values: unknown[] = [];
  const assignments: string[] = [];

  for (const [key, value] of Object.entries(input)) {
    const column = columnMap[key];

    if (!column || value === undefined) {
      continue;
    }

    values.push(value);
    const parameter = `$${values.length}`;

    if (key === 'inspected_at') {
      assignments.push(`${column} = ${parameter}::timestamptz`);
    } else {
      assignments.push(`${column} = ${parameter}`);
    }
  }

  if (assignments.length === 0) {
    return findInspectionById(id);
  }

  assignments.push('updated_at = NOW()');

  values.push(id);

  const result = await pool.query<Inspection>(
    `
      UPDATE app.inspections
      SET ${assignments.join(', ')}
      WHERE inspection_id = $${values.length}
      RETURNING *
    `,
    values,
  );

  return result.rows[0] ?? null;
}

export async function deleteInspection(
  id: number,
): Promise<boolean> {
  const result = await pool.query(
    `
      DELETE FROM app.inspections
      WHERE inspection_id = $1
      RETURNING inspection_id
    `,
    [id],
  );

  return result.rowCount !== null && result.rowCount > 0;
}
