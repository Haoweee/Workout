import { useEffect, useState } from 'react';
import { routineService } from '@/services/routine.service';
import type { Routine } from '@/types/api';

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
