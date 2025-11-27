import { useState, useEffect, useCallback } from 'react';

import { exerciseService } from '@/services/exercises.service';

import type { ExerciseResponse } from '@/types/exercise';

import { logger } from '@/lib/logger';

/**
 * Custom hook to fetch exercise details by ID
 * @param exerciseId - The ID of the exercise to fetch
 * @returns An object containing the exercise details, loading state, error state, and a refresh handler
 *
 * @example
 * const { exercise, isLoading, error, handleRefresh } = useGetExerciseDetail(exerciseId);
 */
export const useGetExerciseDetail = (exerciseId?: string) => {
  const [exercise, setExercise] = useState<ExerciseResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercise = useCallback(async (id?: string) => {
    if (!id) {
      logger.error('Exercise ID not provided');
      setError('Exercise ID is required');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const exerciseData = await exerciseService.getExerciseById(parseInt(id, 10));
      setExercise(exerciseData);
    } catch (err) {
      logger.error('Failed to fetch exercise:', err);
      setError('Failed to load exercise details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    if (exerciseId) {
      await fetchExercise(exerciseId);
    }
  }, [fetchExercise, exerciseId]);

  useEffect(() => {
    if (exerciseId) {
      fetchExercise(exerciseId);
    }
  }, [exerciseId, fetchExercise]);

  return {
    exercise,
    isLoading,
    error,
    handleRefresh,
  };
};
