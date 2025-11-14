import { useState } from 'react';
import { apiClient, apiCall } from '@/lib/api-client';
import type { Routine, ApiResponse } from '@/types/api';

export interface UseCreateRoutineRequest {
  title: string;
  description?: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  visibility: 'PUBLIC' | 'PRIVATE';
  exercises?: {
    exerciseId?: number;
    customExerciseName?: string;
    dayIndex: number;
    orderIndex: number;
    sets?: string;
    reps?: string;
    restSeconds?: number;
    notes?: string;
  }[];
}

// Helper function to create routine with our specific structure
const createRoutineWithExercises = async (data: UseCreateRoutineRequest): Promise<Routine> => {
  return await apiCall<Routine>(() => apiClient.post<ApiResponse<Routine>>('/routines', data));
};

interface UseCreateRoutineReturn {
  createRoutine: (data: UseCreateRoutineRequest) => Promise<Routine | null>;
  isLoading: boolean;
  createError: string | null;
  success: boolean;
  reset: () => void;
}

export const useCreateRoutine = (): UseCreateRoutineReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createRoutine = async (data: UseCreateRoutineRequest): Promise<Routine | null> => {
    setIsLoading(true);
    setCreateError(null);
    setSuccess(false);

    try {
      // Use our helper function that handles the API call correctly
      const result = await createRoutineWithExercises(data);

      setSuccess(true);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to create routine. Please try again.';
      setCreateError(errorMessage);
      console.error('Error creating routine:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setCreateError(null);
    setSuccess(false);
  };

  return {
    createRoutine,
    isLoading,
    createError,
    success,
    reset,
  };
};
