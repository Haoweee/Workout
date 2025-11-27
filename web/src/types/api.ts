// Base response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SendOtpRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  type?: 'register' | 'changePassword';
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  type: 'register' | 'changePassword';
}

export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  type?: 'register' | 'changePassword';
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    username: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

// Health check type
export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version?: string;
}
