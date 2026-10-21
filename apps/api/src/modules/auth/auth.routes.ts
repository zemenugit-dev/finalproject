
import { Router } from 'express';
import {
  register,
  login,
  getMyProfile
} from './auth.controller';
import { requireAuth } from './auth.middleware';
import { requireRole } from './role.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Protected route: requires a valid JWT token
router.get('/me', requireAuth, getMyProfile);

// Test route: only Admin users can access it
router.get(
  '/admin-test',
  requireAuth,
  requireRole('Admin'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Admin authorization successful'
    });
  }
);

export default router;

