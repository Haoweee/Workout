// Authentication Service
import type { LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '@/types/api';
import { apiClient, apiCall, tokenManager } from '@/lib/api-client';
import { logger } from '@/lib/logger';

export const authService = {
  // User login
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      // Call the API directly without apiCall wrapper since the response structure is different
      const response = await apiClient.post('/auth/login', credentials);

      // Debug: Log the response to see what we're getting
      logger.debug('Login response:', response.data);

      // Check if we got a valid response
      if (!response.data) {
        throw new Error('No data received from login API');
      }

      if (!response.data.success) {
        throw new Error(response.data.error || 'Login failed');
      }

      if (!response.data.token) {
        throw new Error('No token received from login API');
      }

      // Store token after successful login
      tokenManager.setToken(response.data.token);

      // Transform the backend response to match our frontend types

      const authResponse: AuthResponse = {
        token: response.data.token,
        refreshToken: response.data.refreshToken || '', // Backend might not have refresh token
        user: {
          id: response.data.user.id,
          email: response.data.user.email,
          fullName: response.data.user.fullName || '',
          username: response.data.user.username || '',
          isActive: response.data.user.isActive !== false, // Default to true if not specified
          createdAt: response.data.user.createdAt,
          updatedAt: response.data.user.updatedAt,
        },
      };

      return authResponse;
    } catch (error) {
      logger.error('Login service error:', error);
      throw error;
    }
  },

  // User registration
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      // Call the API directly without apiCall wrapper since the response structure is different
      const response = await apiClient.post('/auth/register', userData);

      // Debug: Log the response to see what we're getting
      logger.debug('Registration response:', response.data);

      // Check if we got a valid response
      if (!response.data) {
        throw new Error('No data received from registration API');
      }

      if (!response.data.success) {
        throw new Error(response.data.error || 'Registration failed');
      }

      if (!response.data.token) {
        throw new Error('No token received from registration API');
      }

      // Store token after successful registration
      tokenManager.setToken(response.data.token);

      // Transform the backend response to match our frontend types
      const authResponse: AuthResponse = {
        token: response.data.token,
        refreshToken: response.data.refreshToken || '', // Backend might not have refresh token
        user: {
          id: response.data.user.id,
          email: response.data.user.email,
          fullName: response.data.user.fullName || '',
          username: response.data.user.username || '',
          isActive: response.data.user.isActive !== false, // Default to true if not specified
          createdAt: response.data.user.createdAt,
          updatedAt: response.data.user.updatedAt,
        },
      };

      return authResponse;
    } catch (error) {
      logger.error('Registration service error:', error);
      throw error;
    }
  },

  // User logout
  logout: async (): Promise<void> => {
    try {
      // Make logout API call first with current token
      await apiCall<null>(() => apiClient.post<ApiResponse<null>>('/auth/logout'));
    } catch (error) {
      // Log the error but continue with logout process
      logger.warn('Logout API call failed:', error);
    } finally {
      // Always clear token, even if the request fails
      tokenManager.removeToken();
    }
  },

  // Refresh token
  refreshToken: async (): Promise<AuthResponse> => {
    const data = await apiCall<AuthResponse>(() =>
      apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh')
    );

    // Update stored token
    tokenManager.setToken(data.token);

    return data;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = tokenManager.getToken();
    return token !== null && !tokenManager.isTokenExpired(token);
  },

  // Get current token
  getToken: (): string | null => {
    return tokenManager.getToken();
  },
};
