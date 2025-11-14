import { useState, useEffect, useCallback } from 'react';
import { exerciseService } from '@/services/exercises.service';
import type { ExerciseResponse } from '@/types/api';

export const useGetExerciseDetail = (exerciseId?: string) => {
  const [exercise, setExercise] = useState<ExerciseResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercise = useCallback(async (id?: string) => {
    if (!id) {
      setError('Exercise ID not provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const exerciseData = await exerciseService.getExerciseById(parseInt(id, 10));
      setExercise(exerciseData);
    } catch (err) {
      console.error('Failed to fetch exercise:', err);
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
