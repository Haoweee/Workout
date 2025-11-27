import { useState, useEffect } from 'react';

import { routineService } from '@/services/routine.service';

import type { Routine, RoutineResponse } from '@/types/routine';

/**
 * Custom hook for fetching a single routine by ID
 *
 * @param id - The routine ID to fetch
 * @returns Object containing routine data, loading state, error state, and refetch function
 */
export const useGetSpecificRoutine = (id: string | undefined): RoutineResponse => {
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutine = async () => {
    if (!id) {
      setError('No routine ID provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const routineData = await routineService.getRoutineById(id);
      setRoutine(routineData);
    } catch (err) {
      console.error('Failed to fetch routine:', err);
      setError('Failed to load routine. Please try again.');
      setRoutine(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const refetch = async () => {
    await fetchRoutine();
  };

  return {
    routine,
    isLoading,
    error,
    refetch,
  };
};
