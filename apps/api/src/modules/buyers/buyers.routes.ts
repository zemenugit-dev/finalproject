
import { Router } from 'express';
import { BuyersController } from './buyers.controller';
import { requireAuth } from '../auth/auth.middleware';
import { requireRole } from '../auth/role.middleware';

const router = Router();
const buyersController = new BuyersController();

// Only Admins can retrieve all buyers
router.get(
  '/',
  requireAuth,
  requireRole('Admin'),
  buyersController.getBuyers
);

// Buyers and Admins can create buyer profiles
router.post(
  '/',
  requireAuth,
  requireRole('Buyer', 'Admin'),
  buyersController.createBuyer
);

export default router;

