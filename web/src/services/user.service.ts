// User Service
import type { User, UpdateProfileRequest, ApiResponse, PaginatedResponse } from '@/types/api';
import { apiClient, apiCall } from '@/lib/api-client';

export const userService = {
  // Get current user profile
  getProfile: async (): Promise<User> => {
    return await apiCall<User>(() => apiClient.get<ApiResponse<User>>('/users/profile'));
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    return await apiCall<User>(() => apiClient.put<ApiResponse<User>>('/users/profile', data));
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    return await apiCall<User>(() => apiClient.get<ApiResponse<User>>(`/users/${id}`));
  },

  // Get all users (admin only)
  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<User[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);

    const response = await apiClient.get<PaginatedResponse<User[]>>(
      `/users?${searchParams.toString()}`
    );
    return response.data;
  },

  // Get user analytics
  getUserAnalytics: async (id: string): Promise<Record<string, unknown>> => {
    return await apiCall<Record<string, unknown>>(() =>
      apiClient.get<ApiResponse<Record<string, unknown>>>(`/users/${id}/analytics`)
    );
  },

  // Upload user avatar
  uploadAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('avatar', file);

    return await apiCall<User>(() =>
      apiClient.post<ApiResponse<User>>('/users/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  },

  // Deactivate user account
  deactivateAccount: async (id: string): Promise<void> => {
    return await apiCall<void>(() => apiClient.patch<ApiResponse<void>>(`/users/${id}/deactivate`));
  },

  // Delete user account
  deleteAccount: async (id: string): Promise<void> => {
    return await apiCall<void>(() => apiClient.delete<ApiResponse<void>>(`/users/${id}`));
  },
};
