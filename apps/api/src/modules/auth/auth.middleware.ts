
import { Request, Response, NextFunction } from 'express';
import { verifyAuthToken, type AuthTokenPayload } from './jwt';

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthTokenPayload;
    }
  }
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authentication token is required'
    });
    return;
  }

  const token = authorization.slice('Bearer '.length).trim();

  try {
    req.authUser = verifyAuthToken(token);
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token'
    });
  }
}

