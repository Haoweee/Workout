import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Routine, CreateRoutineRequest } from '@/types/routine';

import { apiClient, apiCall } from '@/lib/api-client';

export const routineService = {
  // Create a new routine
  createRoutine: async (data: CreateRoutineRequest): Promise<Routine> => {
    return await apiCall<Routine>(() => apiClient.post<ApiResponse<Routine>>('/routines', data));
  },

  // Get routine by ID
  getRoutineById: async (id: string): Promise<Routine> => {
    return await apiCall<Routine>(() => apiClient.get<ApiResponse<Routine>>(`/routines/${id}`));
  },

  // Get user's routines
  getUserRoutines: async (): Promise<Routine[]> => {
    return await apiCall<Routine[]>(() => apiClient.get<ApiResponse<Routine[]>>('/routines/my'));
  },

  // Get public routines with pagination
  getPublicRoutines: async (params?: {
    page?: number;
    limit?: number;
    difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    search?: string;
  }): Promise<PaginatedResponse<Routine[]>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.difficulty) searchParams.append('difficulty', params.difficulty);
    if (params?.search) searchParams.append('search', params.search);

    const queryString = searchParams.toString();
    const url = queryString ? `/routines/public?${queryString}` : '/routines/public';

    const response = await apiClient.get<PaginatedResponse<Routine[]>>(url);
    return response.data;
  },

  // Update routine
  updateRoutine: async (id: string, data: Partial<CreateRoutineRequest>): Promise<Routine> => {
    return await apiCall<Routine>(() =>
      apiClient.put<ApiResponse<Routine>>(`/routines/${id}`, data)
    );
  },

  // Delete routine
  deleteRoutine: async (id: string): Promise<void> => {
    await apiCall<null>(() => apiClient.delete<ApiResponse<null>>(`/routines/${id}`));
  },

  // Clone routine
  cloneRoutine: async (id: string, title?: string): Promise<Routine> => {
    return await apiCall<Routine>(() =>
      apiClient.post<ApiResponse<Routine>>(`/routines/${id}/clone`, { title })
    );
  },
};
