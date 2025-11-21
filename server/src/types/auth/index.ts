import { User } from '@prisma/client';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface RegisterResponse {
  success: boolean;
  user: {
    username: string;
    fullName: string;
    email: string;
    passwordHash?: string;
  };
  token: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    isEmailVerified: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

// Legacy auth types (still used in some controllers)
export interface CreateUserRequest {
  username: string;
  fullName: string;
  email: string;
  password: string;
  avatarUrl?: string;
}

// Legacy login request format (uses email field instead of usernameOrEmail)
export interface EmailLoginRequest {
  email: string;
  password: string;
}

// Service layer auth response format with success field
export interface ServiceAuthResponse {
  success: boolean;
  user: Omit<User, 'passwordHash'>;
  token: string;
  refreshToken?: string;
  message?: string;
}

export interface OAuthUrlResponse {
  success: boolean;
  redirectUrl: string;
}

export interface OAuthCallbackResult {
  success: boolean;
  token?: string;
  user?: string;
  error?: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
}
