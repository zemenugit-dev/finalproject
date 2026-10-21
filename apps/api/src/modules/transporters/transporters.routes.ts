import { Router } from 'express';
import {
  getTransporters,
  getTransporterById,
  createTransporter,
} from './transporters.controller';

import { requireAuth } from '../auth/auth.middleware';
import { requireRole } from '../auth/role.middleware';

const router = Router();

// Admins can view all transporters
router.get(
  '/',
  requireAuth,
  requireRole('Admin'),
  getTransporters
);

// Admins can view one transporter
router.get(
  '/:id',
  requireAuth,
  requireRole('Admin'),
  getTransporterById
);

// Transporters and admins can create profiles
router.post(
  '/',
  requireAuth,
  requireRole('Transporter', 'Admin'),
  createTransporter
);

export default router;
