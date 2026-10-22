
import { Router } from 'express';
import { AuditController } from './audit.controller';
import { requireAuth } from '../auth/auth.middleware';
import { requireRole } from '../auth/role.middleware';

const router = Router();
const auditController = new AuditController();

router.use(requireAuth);

router.get(
  '/',
  requireRole('Admin'),
  auditController.getAuditLogs
);

router.get(
  '/:auditId',
  requireRole('Admin'),
  auditController.getAuditLogById
);

export default router;
