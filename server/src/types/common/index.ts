export interface PaginationRequest {
  page?: number;
  limit?: number;
}

export interface PaginationResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Legacy pagination response format (still used in some controllers)
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

export interface SuccessResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

// Legacy API response format (still used in some controllers)
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SearchRequest {
  q?: string;
  search?: string;
  query?: string;
}

export interface SortRequest {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface StatsResponse {
  totalFiles: number;
  totalSize: number;
  orphanedFiles: number;
  averageFileSize: number;
}
