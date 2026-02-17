import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from '../constants/pagination.constants';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface NormalizedPagination {
  page: number;
  limit: number;
}

/**
 * @param params - Параметри пагінації з query
 * @returns Нормалізовані параметри пагінації
 */
export function normalizePagination(
  params: PaginationParams,
): NormalizedPagination {
  const page = params.page && params.page > 0 ? params.page : DEFAULT_PAGE;
  const limit =
    params.limit && params.limit > 0 && params.limit <= MAX_LIMIT
      ? params.limit
      : DEFAULT_LIMIT;

  return { page, limit };
}
