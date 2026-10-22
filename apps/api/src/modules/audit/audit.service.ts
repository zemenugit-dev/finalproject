
import { AuditRepository } from './audit.repository';
import {
  AuditLogFilters,
  CreateAuditLogInput,
  validateCreateAuditLog
} from './audit.schema';

export class AuditService {
  private readonly repository: AuditRepository;

  constructor() {
    this.repository = new AuditRepository();
  }

  async createAuditLog(input: unknown) {
    if (!validateCreateAuditLog(input)) {
      throw new Error('Invalid audit log data.');
    }

    return this.repository.create(input);
  }

  async getAuditLogs(filters: AuditLogFilters = {}) {
    this.validateFilters(filters);
    return this.repository.findAll(filters);
  }

  async getAuditLogById(auditId: number) {
    if (!Number.isSafeInteger(auditId) || auditId <= 0) {
      throw new Error('Invalid audit log ID.');
    }

    return this.repository.findById(auditId);
  }

  private validateFilters(filters: AuditLogFilters): void {
    if (
      filters.userId !== undefined &&
      (!Number.isSafeInteger(filters.userId) || filters.userId <= 0)
    ) {
      throw new Error('Invalid user ID filter.');
    }

    if (
      filters.action !== undefined &&
      (typeof filters.action !== 'string' || filters.action.length > 100)
    ) {
      throw new Error('Invalid action filter.');
    }

    if (
      filters.entityType !== undefined &&
      (
        typeof filters.entityType !== 'string' ||
        filters.entityType.length > 100
      )
    ) {
      throw new Error('Invalid entity type filter.');
    }

    const validDate = (date: string) =>
      /^\d{4}-\d{2}-\d{2}$/.test(date) &&
      !Number.isNaN(Date.parse(`${date}T00:00:00Z`)) &&
      new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date;

    if (
      filters.startDate !== undefined &&
      !validDate(filters.startDate)
    ) {
      throw new Error('Invalid start date. Use YYYY-MM-DD.');
    }

    if (
      filters.endDate !== undefined &&
      !validDate(filters.endDate)
    ) {
      throw new Error('Invalid end date. Use YYYY-MM-DD.');
    }

    if (
      filters.startDate &&
      filters.endDate &&
      filters.startDate > filters.endDate
    ) {
      throw new Error('Start date must not be after end date.');
    }
  }
}
