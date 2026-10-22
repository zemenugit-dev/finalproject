
import { Request, Response } from 'express';
import { AuditService } from './audit.service';
import { AuditLogFilters } from './audit.schema';

export class AuditController {
  private readonly service: AuditService;

  constructor() {
    this.service = new AuditService();
  }

  createAuditLog = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const input = {
        userId: req.body.userId,
        action: req.body.action,
        entityType: req.body.entityType,
        entityId: req.body.entityId,
        details: req.body.details,
        ipAddress: req.ip
      };

      const data = await this.service.createAuditLog(input);

      res.status(201).json({
        success: true,
        message: 'Audit log created successfully.',
        data
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Invalid audit log data.'
      ) {
        res.status(400).json({
          success: false,
          message: error.message
        });
        return;
      }

      console.error('Create audit log error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to create audit log.'
      });
    }
  };

  getAuditLogs = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const filters: AuditLogFilters = {};

      if (req.query.userId !== undefined) {
        const userId = Number(req.query.userId);

        if (!Number.isSafeInteger(userId) || userId <= 0) {
          res.status(400).json({
            success: false,
            message: 'Invalid userId filter.'
          });
          return;
        }

        filters.userId = userId;
      }

      if (typeof req.query.action === 'string') {
        filters.action = req.query.action;
      }

      if (typeof req.query.entityType === 'string') {
        filters.entityType = req.query.entityType;
      }

      if (typeof req.query.startDate === 'string') {
        filters.startDate = req.query.startDate;
      }

      if (typeof req.query.endDate === 'string') {
        filters.endDate = req.query.endDate;
      }

      const data = await this.service.getAuditLogs(filters);

      res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (error) {
      if (error instanceof Error) {
        const validationMessages = [
          'Invalid user ID filter.',
          'Invalid action filter.',
          'Invalid entity type filter.',
          'Invalid start date. Use YYYY-MM-DD.',
          'Invalid end date. Use YYYY-MM-DD.',
          'Start date must not be after end date.'
        ];

        if (validationMessages.includes(error.message)) {
          res.status(400).json({
            success: false,
            message: error.message
          });
          return;
        }
      }

      console.error('Get audit logs error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to retrieve audit logs.'
      });
    }
  };

  getAuditLogById = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const auditId = Number(req.params.auditId);

      if (!Number.isSafeInteger(auditId) || auditId <= 0) {
        res.status(400).json({
          success: false,
          message: 'Invalid audit log ID.'
        });
        return;
      }

      const data = await this.service.getAuditLogById(auditId);

      if (!data) {
        res.status(404).json({
          success: false,
          message: 'Audit log not found.'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Get audit log error:', error);

      res.status(500).json({
        success: false,
        message: 'Failed to retrieve audit log.'
      });
    }
  };
}
