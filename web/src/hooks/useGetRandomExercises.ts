import { useState, useEffect, useCallback, useRef } from 'react';
import { exerciseService } from '@/services/exercises.service';
import type { ExerciseResponse } from '@/types/api';

export const useGetRandomExercises = () => {
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentPageRef = useRef(1);

  const getRandomExercises = useCallback(
    async (page: number = 1, limit: number = 12): Promise<ExerciseResponse[]> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await exerciseService.getRandomExercises({
          page,
          limit,
        });
        setExercises(response.data);

        // Calculate hasNext and hasPrev if not provided by server
        const paginationWithCalculatedFields = {
          ...response.pagination,
          hasNext:
            response.pagination.hasNext ?? response.pagination.page < response.pagination.pages,
          hasPrev: response.pagination.hasPrev ?? response.pagination.page > 1,
        };

        setPagination(paginationWithCalculatedFields);
        currentPageRef.current = response.pagination.page;
        return response.data;
      } catch (err) {
        console.error('Failed to fetch random exercises:', err);
        setError('Failed to load exercises. Please try again.');
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const goToPage = useCallback(
    (page: number) => {
      getRandomExercises(page, 12);
    },
    [getRandomExercises]
  );

  const nextPage = useCallback(() => {
    getRandomExercises(currentPageRef.current + 1, 12);
  }, [getRandomExercises]);

  const prevPage = useCallback(() => {
    getRandomExercises(currentPageRef.current - 1, 12);
  }, [getRandomExercises]);

  useEffect(() => {
    getRandomExercises();
  }, [getRandomExercises]);

  return {
    exercises,
    pagination,
    isLoading,
    error,
    getRandomExercises,
    goToPage,
    nextPage,
    prevPage,
  };
};
