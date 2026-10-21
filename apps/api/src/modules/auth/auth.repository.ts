
import pool from '../../config/database';

export interface UserRecord {
  user_id: string;
  full_name: string;
  phone_number: string;
  email: string | null;
  password_hash: string;
  role_id: string | null;
  role_name: string | null;
  is_verified: boolean | null;
}

export interface CreateUserInput {
  full_name: string;
  phone_number: string;
  email?: string | null;
  password_hash: string;
  role_name: string;
}

export async function findUserByPhone(
  phoneNumber: string
): Promise<UserRecord | null> {
  const result = await pool.query(
    `SELECT
       u.user_id,
       u.full_name,
       u.phone_number,
       u.email,
       u.password_hash,
       u.role_id,
       r.name AS role_name,
       u.is_verified
     FROM app.users u
     LEFT JOIN app.roles r ON r.role_id = u.role_id
     WHERE u.phone_number = $1
     LIMIT 1`,
    [phoneNumber]
  );

  return result.rows[0] ?? null;
}

export async function findUserByEmail(
  email: string
): Promise<UserRecord | null> {
  const result = await pool.query(
    `SELECT
       u.user_id,
       u.full_name,
       u.phone_number,
       u.email,
       u.password_hash,
       u.role_id,
       r.name AS role_name,
       u.is_verified
     FROM app.users u
     LEFT JOIN app.roles r ON r.role_id = u.role_id
     WHERE LOWER(u.email) = LOWER($1)
     LIMIT 1`,
    [email]
  );

  return result.rows[0] ?? null;
}

export async function findRoleByName(
  roleName: string
): Promise<{ role_id: string; name: string } | null> {
  const result = await pool.query(
    `SELECT role_id, name
     FROM app.roles
     WHERE LOWER(name) = LOWER($1)
     LIMIT 1`,
    [roleName]
  );

  return result.rows[0] ?? null;
}

export async function createUser(
  input: CreateUserInput
): Promise<Omit<UserRecord, 'password_hash'>> {
  const role = await findRoleByName(input.role_name);

  if (!role) {
    throw new Error('Selected role does not exist');
  }

  const result = await pool.query(
    `INSERT INTO app.users
       (full_name, phone_number, email, password_hash, role_id, is_verified)
     VALUES ($1, $2, $3, $4, $5, TRUE)
     RETURNING
       user_id,
       full_name,
       phone_number,
       email,
       role_id,
       is_verified`,
    [
      input.full_name,
      input.phone_number,
      input.email ?? null,
      input.password_hash,
      role.role_id
    ]
  );

  return {
    ...result.rows[0],
    role_name: role.name
  };
}

