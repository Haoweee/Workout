import { useState } from 'react';

import { apiClient, apiCall } from '@/lib/api-client';

import type { ApiResponse } from '@/types/api';
import type { Routine, UpdateRoutineRequest } from '@/types/routine';

// Helper function to update routine with our specific structure
const updateRoutineWithExercises = async (
  id: string,
  data: UpdateRoutineRequest
): Promise<Routine> => {
  return await apiCall<Routine>(() => apiClient.put<ApiResponse<Routine>>(`/routines/${id}`, data));
};

/**
 * Hook for updating routines
 *
 * Provides functionality to update existing routines with proper error handling
 * and loading states.
 *
 * @example
 * const { updateRoutine, isLoading, updateError } = useUpdateRoutine();
 */
export const useUpdateRoutine = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const updateRoutine = async (
    id: string,
    routineData: UpdateRoutineRequest
  ): Promise<Routine | null> => {
    try {
      setIsLoading(true);
      setUpdateError(null);

      const updatedRoutine = await updateRoutineWithExercises(id, routineData);
      return updatedRoutine;
    } catch (error) {
      console.error('Failed to update routine:', error);

      // Extract error message from the error response
      let errorMessage = 'Failed to update routine. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String(error.message);
      }

      setUpdateError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateRoutine,
    isLoading,
    updateError,
  };
};
