import type { ApiResponse } from '@/types/api';
import type {
  Workout,
  CreateWorkoutRequest,
  UpdateWorkoutRequest,
  WorkoutSet,
  CreateWorkoutSetRequest,
  UpdateWorkoutSetRequest,
  WorkoutStats,
  AnalyticsType,
  ChartDataPoint,
  OptimizedWorkout,
  GetUserWorkoutsOptions,
  GetUserWorkoutsResponse,
  WorkoutsApiResponse,
} from '@/types/workout';

import { apiClient, apiCall } from '@/lib/api-client';

export const workoutService = {
  // Create a new workout
  createWorkout: async (data: CreateWorkoutRequest): Promise<Workout> => {
    return await apiCall<Workout>(() => apiClient.post<ApiResponse<Workout>>('/workouts', data));
  },

  // Get user's workouts
  getUserWorkouts: async (
    options: GetUserWorkoutsOptions = {}
  ): Promise<GetUserWorkoutsResponse> => {
    const params = new URLSearchParams();

    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());
    if (options.includeFinished !== undefined) {
      params.append('includeFinished', options.includeFinished.toString());
    }
    if (options.routineId) params.append('routineId', options.routineId);

    // Make the API call directly to get the full response structure
    const response = await apiClient.get<WorkoutsApiResponse>(`/workouts?${params.toString()}`);

    // The server returns { message, data: Workout[], pagination: {...} }
    return {
      workouts: response.data.data || [], // The workouts array is in response.data.data
      pagination: response.data.pagination || {
        total: 0,
        limit: 20,
        offset: 0,
        hasMore: false,
      },
    };
  },

  // Get workout by ID (optimized with grouped exercises)
  getWorkoutById: async (id: string): Promise<OptimizedWorkout> => {
    return await apiCall<OptimizedWorkout>(() =>
      apiClient.get<ApiResponse<OptimizedWorkout>>(`/workouts/${id}`)
    );
  },

  // Update workout
  updateWorkout: async (id: string, data: UpdateWorkoutRequest): Promise<Workout> => {
    return await apiCall<Workout>(() =>
      apiClient.put<ApiResponse<Workout>>(`/workouts/${id}`, data)
    );
  },

  // Delete workout
  deleteWorkout: async (id: string): Promise<void> => {
    return await apiCall<void>(() => apiClient.delete(`/workouts/${id}`));
  },

  // Finish workout
  finishWorkout: async (id: string): Promise<Workout> => {
    return await apiCall<Workout>(() =>
      apiClient.post<ApiResponse<Workout>>(`/workouts/${id}/finish`)
    );
  },

  // Add workout set
  addWorkoutSet: async (workoutId: string, data: CreateWorkoutSetRequest): Promise<WorkoutSet> => {
    return await apiCall<WorkoutSet>(() =>
      apiClient.post<ApiResponse<WorkoutSet>>(`/workouts/${workoutId}/sets`, data)
    );
  },

  // Update workout set
  updateWorkoutSet: async (setId: string, data: UpdateWorkoutSetRequest): Promise<WorkoutSet> => {
    return await apiCall<WorkoutSet>(() =>
      apiClient.put<ApiResponse<WorkoutSet>>(`/workouts/sets/${setId}`, data)
    );
  },

  // Delete workout set
  deleteWorkoutSet: async (setId: string): Promise<void> => {
    return await apiCall<void>(() => apiClient.delete(`/workouts/sets/${setId}`));
  },

  // Delete workout set by exercise and set number
  deleteWorkoutSetByExercise: async (
    workoutId: string,
    exerciseId: number | null,
    customExerciseName: string | null,
    setNumber: number
  ): Promise<void> => {
    return await apiCall<void>(() =>
      apiClient.delete(`/workouts/${workoutId}/sets/by-exercise`, {
        data: {
          exerciseId,
          customExerciseName,
          setNumber: setNumber.toString(),
        },
      })
    );
  },

  // Get workout statistics
  getWorkoutStats: async (): Promise<WorkoutStats> => {
    return await apiCall<WorkoutStats>(() =>
      apiClient.get<ApiResponse<WorkoutStats>>('/workouts/stats')
    );
  },

  // Get workout analytics for charts
  getWorkoutAnalytics: async (
    type: AnalyticsType,
    months: number = 6
  ): Promise<ChartDataPoint[]> => {
    const params = new URLSearchParams({
      type,
      months: months.toString(),
    });

    return await apiCall<ChartDataPoint[]>(() =>
      apiClient.get<ApiResponse<ChartDataPoint[]>>(`/workouts/analytics?${params}`)
    );
  },
};
