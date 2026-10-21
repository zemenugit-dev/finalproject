
import { generateAuthToken } from './jwt';
import bcrypt from 'bcryptjs';

import {
  createUser,
  findUserByPhone,
  findUserByEmail,
  findRoleByName,
  type UserRecord
} from './auth.repository';

import type { RegisterInput, LoginInput } from './auth.schema';

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

function publicUser(user: UserRecord | Omit<UserRecord, 'password_hash'>) {
  const { password_hash: _passwordHash, ...safeUser } =
    user as UserRecord;

  return safeUser;
}

export async function registerUser(input: RegisterInput) {
  const phoneNumber = input.phone_number.trim();
  const email = input.email?.trim().toLowerCase() || null;

  const existingPhone = await findUserByPhone(phoneNumber);

  if (existingPhone) {
    throw new AuthError('Phone number is already registered', 409);
  }

  if (email) {
    const existingEmail = await findUserByEmail(email);

    if (existingEmail) {
      throw new AuthError('Email is already registered', 409);
    }
  }

  const role = await findRoleByName(input.role_name);

  if (!role) {
    throw new AuthError('Selected role does not exist', 400);
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  try {
    const user = await createUser({
      full_name: input.full_name.trim(),
      phone_number: phoneNumber,
      email,
      password_hash: passwordHash,
      role_name: role.name
    });

    return user;
  } catch (error) {
    // Handle a concurrent registration that violates a unique constraint.
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === '23505'
    ) {
      throw new AuthError(
        'Phone number or email is already registered',
        409
      );
    }

    throw error;
  }
}

export async function loginUser(input: LoginInput) {
  const user = await findUserByPhone(input.phone_number.trim());

  if (!user) {
    throw new AuthError('Invalid phone number or password', 401);
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.password_hash
  );

  if (!passwordMatches) {
    throw new AuthError('Invalid phone number or password', 401);
  }

if (user.is_verified === false) {
  throw new AuthError('Account is not verified', 403);
}

const token = generateAuthToken(user);

return {
  user: publicUser(user),
  token
};
}

