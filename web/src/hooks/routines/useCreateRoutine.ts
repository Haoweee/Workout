import { useState } from 'react';

import { apiClient, apiCall } from '@/lib/api-client';

import type { ApiResponse } from '@/types/api';
import type { CreateRoutineRequest, CreateRoutineResponse, Routine } from '@/types/routine';

// Helper function to create routine with our specific structure
const createRoutineWithExercises = async (data: CreateRoutineRequest): Promise<Routine> => {
  return await apiCall<Routine>(() => apiClient.post<ApiResponse<Routine>>('/routines', data));
};

/**
 * Custom hook to create a new routine
 * @returns {CreateRoutineResponse} Functions and state for creating a routine
 *
 * @example
 * const { createRoutine, isLoading, createError, success, reset } = useCreateRoutine();
 */
export const useCreateRoutine = (): CreateRoutineResponse => {
  const [isLoading, setIsLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createRoutine = async (data: CreateRoutineRequest): Promise<Routine | null> => {
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
