
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';

export interface AuthTokenPayload extends JwtPayload {
  user_id: string;
  phone_number: string;
  role_name: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      'JWT_SECRET is missing or too short. Check your API .env file.'
    );
  }

  return secret;
}

export function generateAuthToken(user: {
  user_id: string;
  phone_number: string;
  role_name: string | null;
}): string {
  if (!user.role_name) {
    throw new Error('Cannot create token without a user role');
  }

  const payload: AuthTokenPayload = {
    user_id: user.user_id,
    phone_number: user.phone_number,
    role_name: user.role_name
  };

  const expiresIn = (
    process.env.JWT_EXPIRES_IN || '1h'
  ) as SignOptions['expiresIn'];

  return jwt.sign(payload, getJwtSecret(), { expiresIn });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  const decoded = jwt.verify(token, getJwtSecret());

  if (
    typeof decoded === 'string' ||
    typeof decoded.user_id !== 'string' ||
    typeof decoded.phone_number !== 'string' ||
    typeof decoded.role_name !== 'string'
  ) {
    throw new Error('Invalid JWT payload');
  }

  return decoded as AuthTokenPayload;
}

