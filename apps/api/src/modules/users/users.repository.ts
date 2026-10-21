import pool from '../../config/database';
import type { UserListQuery, UpdateUserInput } from './users.schema';

export interface UserRecord {
  user_id: number;
  full_name: string;
  phone_number: string;
  email: string | null;
  role_id: number;
  is_verified: boolean;
}

const userColumns = `
  user_id,
  full_name,
  phone_number,
  email,
  role_id,
  is_verified
`;

export async function findAllUsers(
  filters: UserListQuery,
): Promise<UserRecord[]> {
  const result = await pool.query<UserRecord>(
    `
      SELECT ${userColumns}
      FROM app.users
      ORDER BY user_id DESC
      LIMIT $1 OFFSET $2
    `,
    [filters.limit, filters.offset],
  );

  return result.rows;
}

export async function findUserById(
  id: number,
): Promise<UserRecord | null> {
  const result = await pool.query<UserRecord>(
    `
      SELECT ${userColumns}
      FROM app.users
      WHERE user_id = $1
      LIMIT 1
    `,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function updateUser(
  id: number,
  input: UpdateUserInput,
): Promise<UserRecord | null> {
  const columnMap: Record<string, string> = {
    full_name: 'full_name',
    phone_number: 'phone_number',
    email: 'email',
  };

  const values: unknown[] = [];
  const assignments: string[] = [];

  for (const [key, value] of Object.entries(input)) {
    const column = columnMap[key];

    if (!column || value === undefined) {
      continue;
    }

    values.push(value === '' && key === 'email' ? null : value);
    assignments.push(`${column} = $${values.length}`);
  }

  if (assignments.length === 0) {
    return findUserById(id);
  }

  values.push(id);

  const result = await pool.query<UserRecord>(
    `
      UPDATE app.users
      SET ${assignments.join(', ')}
      WHERE user_id = $${values.length}
      RETURNING ${userColumns}
    `,
    values,
  );

  return result.rows[0] ?? null;
}

export async function deleteUser(id: number): Promise<boolean> {
  const result = await pool.query(
    `
      DELETE FROM app.users
      WHERE user_id = $1
      RETURNING user_id
    `,
    [id],
  );

  return (result.rowCount ?? 0) > 0;
}
