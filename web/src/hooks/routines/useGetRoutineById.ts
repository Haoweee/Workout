import { useEffect, useState } from 'react';

import { routineService } from '@/services/routine.service';

import type { Routine } from '@/types/routine';

/**
 * Custom hook to fetch a routine by its ID
 * @param id - The ID of the routine to fetch
 * @returns An object containing the routine, loading state, and any error message
 *
 * @example
 * const { routine, isLoading, error } = useGetRoutineById(routineId);
 */
export const useGetRoutineById = (id: string) => {
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoutine();
  }, [id]);

  return { routine, isLoading, error };
};
