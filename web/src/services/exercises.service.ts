import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { ExerciseResponse } from '@/types/exercise';

import { apiClient, apiCall, paginatedApiCall } from '@/lib/api-client';

export const exerciseService = {
  // Get random exercises with pagination
  getRandomExercises: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<ExerciseResponse[]>> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const url = queryString ? `/exercises/random?${queryString}` : '/exercises/random';

    return await paginatedApiCall<ExerciseResponse[]>(() =>
      apiClient.get<PaginatedResponse<ExerciseResponse[]>>(url)
    );
  },

  // Get all exercises with filters and pagination
  getAllExercises: async (params?: {
    page?: number;
    limit?: number;
    category?: 'STRENGTH' | 'CARDIO' | 'MOBILITY';
    level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    primaryMuscles?: string;
    equipment?: string;
    force?: string;
    mechanic?: string;
    search?: string;
  }): Promise<PaginatedResponse<ExerciseResponse[]>> => {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.level) searchParams.append('level', params.level);
    if (params?.primaryMuscles) searchParams.append('primaryMuscles', params.primaryMuscles);
    if (params?.equipment) searchParams.append('equipment', params.equipment);
    if (params?.force) searchParams.append('force', params.force);
    if (params?.mechanic) searchParams.append('mechanic', params.mechanic);
    if (params?.search) searchParams.append('search', params.search);

    const queryString = searchParams.toString();
    const url = queryString ? `/exercises?${queryString}` : '/exercises';

    return await paginatedApiCall<ExerciseResponse[]>(() =>
      apiClient.get<PaginatedResponse<ExerciseResponse[]>>(url)
    );
  },

  // Get exercise by ID
  getExerciseById: async (id: number): Promise<ExerciseResponse> => {
    return await apiCall<ExerciseResponse>(() =>
      apiClient.get<ApiResponse<ExerciseResponse>>(`/exercises/${id}`)
    );
  },

  // Get exercise filter options
  getFilterOptions: async (): Promise<{
    categories: string[];
    levels: string[];
    muscleGroups: string[];
    equipmentTypes: string[];
    forceTypes: string[];
    mechanicTypes: string[];
  }> => {
    return await apiCall<{
      categories: string[];
      levels: string[];
      muscleGroups: string[];
      equipmentTypes: string[];
      forceTypes: string[];
      mechanicTypes: string[];
    }>(() =>
      apiClient.get<
        ApiResponse<{
          categories: string[];
          levels: string[];
          muscleGroups: string[];
          equipmentTypes: string[];
          forceTypes: string[];
          mechanicTypes: string[];
        }>
      >('/exercises/filter-options')
    );
  },

  // Get simple exercise list (for routine creation)
  getExerciseList: async (): Promise<{ id: number; name: string }[]> => {
    return await apiCall<{ id: number; name: string }[]>(() =>
      apiClient.get<ApiResponse<{ id: number; name: string }[]>>('/exercises/list')
    );
  },
};
