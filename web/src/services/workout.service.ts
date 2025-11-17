import { apiClient, apiCall } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api';

export interface CreateWorkoutRequest {
  routineId?: string;
  title?: string;
  visibility?: 'PRIVATE' | 'PUBLIC' | 'UNLISTED';
  dayIndex?: number; // Add dayIndex to specify which day's exercises to include
}

export interface UpdateWorkoutRequest {
  title?: string;
  visibility?: 'PRIVATE' | 'PUBLIC' | 'UNLISTED';
  finishedAt?: string | null;
}

export interface CreateWorkoutSetRequest {
  exerciseId?: number;
  customExerciseName?: string;
  customExerciseCategory?: string;
  customExercisePrimaryMuscles?: string[];
  setNumber?: number;
  reps?: number;
  weightKg?: number;
  rpe?: number;
  durationSec?: number;
  notes?: string;
}

export interface UpdateWorkoutSetRequest {
  reps?: number;
  weightKg?: number;
  rpe?: number;
  durationSec?: number;
  notes?: string;
}

export interface Workout {
  id: string;
  userId: string;
  routineId: string | null;
  title: string | null;
  visibility: 'PRIVATE' | 'PUBLIC' | 'UNLISTED';
  startedAt: string;
  finishedAt: string | null;
  workoutSets: WorkoutSet[];
  routine?: {
    id: string;
    title: string;
  } | null;
}

export interface OptimizedSet {
  setNumber: number;
  reps: string | null;
  weightKg: number | null;
  rpe: number | null;
  notes: string | null;
  completed: boolean;
}

export interface OptimizedExercise {
  exerciseId: number | null;
  exerciseName: string;
  isCustom: boolean;
  orderIndex: number;
  sets: OptimizedSet[];
}

export interface OptimizedWorkout {
  id: string;
  userId: string;
  routineId: string | null;
  title: string | null;
  visibility: 'PRIVATE' | 'PUBLIC' | 'UNLISTED';
  startedAt: string;
  finishedAt: string | null;
  routine?: {
    id: string;
    title: string;
  } | null;
  exercises: OptimizedExercise[];
}

export interface WorkoutSet {
  id: string;
  workoutId: string;
  exerciseId: number | null;
  customExerciseName: string | null;
  customExerciseCategory: string | null;
  customExercisePrimaryMuscles: string[];
  setNumber: number;
  reps: number | null;
  weightKg: number | null;
  rpe: number | null;
  durationSec: number | null;
  notes: string | null;
  performedAt: string;
  exercise?: {
    id: number;
    name: string;
    category: string | null;
    primaryMuscles: string[];
    secondaryMuscles: string[];
  };
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalSets: number;
  totalVolume: number;
  averageWorkoutDuration: number;
  workoutsThisWeek: number;
  workoutsThisMonth: number;
}

export interface ChartDataPoint {
  month?: string;
  desktop?: number;
  muscleGroup?: string;
  exercises?: number;
}

export interface AnalyticsResponse {
  data: ChartDataPoint[];
}

export type AnalyticsType = 'overall-progress' | 'muscle-groups' | 'volume-over-time';

export interface GetUserWorkoutsOptions {
  limit?: number;
  offset?: number;
  includeFinished?: boolean;
  routineId?: string;
}

export interface GetUserWorkoutsResponse {
  workouts: Workout[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// Internal API response type for getUserWorkouts
interface WorkoutsApiResponse {
  message: string;
  data: Workout[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

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
