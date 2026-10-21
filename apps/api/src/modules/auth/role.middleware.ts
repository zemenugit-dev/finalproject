
import { Request, Response, NextFunction } from 'express';

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // The user must first pass JWT authentication.
    if (!req.authUser) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    // Check whether the user's role is permitted.
    if (!allowedRoles.includes(req.authUser.role_name)) {
      res.status(403).json({
        success: false,
        message: 'Access denied: insufficient permissions'
      });
      return;
    }

    next();
  };
}

