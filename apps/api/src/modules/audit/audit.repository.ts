
import pool from '../../config/database';
import {
  AuditLog,
  AuditLogFilters,
  CreateAuditLogInput
} from './audit.schema';

export class AuditRepository {
  async create(input: CreateAuditLogInput): Promise<AuditLog> {
    const result = await pool.query<AuditLog>(
      `
        INSERT INTO app.audit_logs (
          user_id,
          action,
          entity_type,
          entity_id,
          details,
          ip_address
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
          audit_id,
          user_id,
          action,
          entity_type,
          entity_id,
          details,
          ip_address,
          created_at
      `,
      [
        input.userId ?? null,
        input.action.trim(),
        input.entityType.trim(),
        input.entityId == null ? null : String(input.entityId),
        JSON.stringify(input.details ?? {}),
        input.ipAddress ?? null
      ]
    );

    return result.rows[0];
  }

  async findAll(
    filters: AuditLogFilters = {}
  ): Promise<AuditLog[]> {
    const conditions: string[] = [];
    const values: unknown[] = [];

    const addCondition = (sql: string, value: unknown) => {
      values.push(value);
      conditions.push(sql.replace('?', `$${values.length}`));
    };

    if (filters.userId !== undefined) {
      addCondition('user_id = ?', filters.userId);
    }

    if (filters.action) {
      addCondition('action ILIKE ?', `%${filters.action}%`);
    }

    if (filters.entityType) {
      addCondition('entity_type ILIKE ?', `%${filters.entityType}%`);
    }

    if (filters.startDate) {
      addCondition('created_at >= ?::date', filters.startDate);
    }

    if (filters.endDate) {
      addCondition(
        "created_at < (?::date + INTERVAL '1 day')",
        filters.endDate
      );
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const result = await pool.query<AuditLog>(
      `
        SELECT
          audit_id,
          user_id,
          action,
          entity_type,
          entity_id,
          details,
          ip_address,
          created_at
        FROM app.audit_logs
        ${whereClause}
        ORDER BY created_at DESC, audit_id DESC
        LIMIT 500
      `,
      values
    );

    return result.rows;
  }

  async findById(auditId: number): Promise<AuditLog | null> {
    const result = await pool.query<AuditLog>(
      `
        SELECT
          audit_id,
          user_id,
          action,
          entity_type,
          entity_id,
          details,
          ip_address,
          created_at
        FROM app.audit_logs
        WHERE audit_id = $1
      `,
      [auditId]
    );

    return result.rows[0] ?? null;
  }
}
