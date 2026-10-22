
export interface CreateAuditLogInput {
  userId?: number | null;
  action: string;
  entityType: string;
  entityId?: string | number | null;
  details?: Record<string, unknown>;
  ipAddress?: string | null;
}

export interface AuditLog {
  audit_id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: Date | string;
}

export interface AuditLogFilters {
  userId?: number;
  action?: string;
  entityType?: string;
  startDate?: string;
  endDate?: string;
}

export function validateCreateAuditLog(
  input: unknown
): input is CreateAuditLogInput {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return false;
  }

  const data = input as Record<string, unknown>;

  if (
    typeof data.action !== 'string' ||
    data.action.trim().length === 0 ||
    data.action.trim().length > 100
  ) {
    return false;
  }

  if (
    typeof data.entityType !== 'string' ||
    data.entityType.trim().length === 0 ||
    data.entityType.trim().length > 100
  ) {
    return false;
  }

  if (
    data.userId !== undefined &&
    data.userId !== null &&
    (!Number.isSafeInteger(data.userId) || Number(data.userId) <= 0)
  ) {
    return false;
  }

  if (
    data.entityId !== undefined &&
    data.entityId !== null &&
    !['string', 'number'].includes(typeof data.entityId)
  ) {
    return false;
  }

  if (
    typeof data.entityId === 'number' &&
    !Number.isSafeInteger(data.entityId)
  ) {
    return false;
  }

  if (
    data.details !== undefined &&
    (
      typeof data.details !== 'object' ||
      data.details === null ||
      Array.isArray(data.details)
    )
  ) {
    return false;
  }

  if (
    data.ipAddress !== undefined &&
    data.ipAddress !== null &&
    typeof data.ipAddress !== 'string'
  ) {
    return false;
  }

  return true;
}
