
import { Router } from 'express';

import {
  getFarmers,
  getFarmerById,
  createFarmer
} from './farmers.controller';

import { requireAuth } from '../auth/auth.middleware';
import { requireRole } from '../auth/role.middleware';

const router = Router();

// GET /api/farmers - Admins only
router.get('/', requireAuth, requireRole('Admin'), getFarmers);

// GET /api/farmers/:id - Admins only
router.get('/:id', requireAuth, requireRole('Admin'), getFarmerById);

// POST /api/farmers - Farmers and Admins
router.post(
  '/',
  requireAuth,
  requireRole('Farmer', 'Admin'),
  createFarmer
);

export default router;

