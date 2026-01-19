/**
 * Shared API types used across the application
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: ApiError[];
}

/**
 * API Error structure
 */
export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

/**
 * Pagination metadata
 */
export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Pagination params for requests
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Sort params
 */
export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Filter params (generic)
 */
export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Common query params
 */
export interface QueryParams
  extends PaginationParams, SortParams, FilterParams {}
