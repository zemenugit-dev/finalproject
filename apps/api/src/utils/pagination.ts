
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export function getPagination(
  pageValue: unknown,
  limitValue: unknown
): PaginationParams {
  const page = parsePositiveInteger(pageValue, DEFAULT_PAGE);
  const requestedLimit = parsePositiveInteger(
    limitValue,
    DEFAULT_LIMIT
  );

  const limit = Math.min(requestedLimit, MAX_LIMIT);
  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset
  };
}

function parsePositiveInteger(
  value: unknown,
  fallback: number
): number {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

export function getPaginationMetadata(
  totalItems: number,
  page: number,
  limit: number
) {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    totalItems,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
}
