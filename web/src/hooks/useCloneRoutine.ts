import { useState } from 'react';
import { routineService } from '@/services';
import type { Routine } from '@/types/api';

export const useCloneRoutine = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cloneRoutine = async (id: string, title?: string): Promise<Routine | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const clonedRoutine = await routineService.cloneRoutine(id, title);
      return clonedRoutine;
    } catch (err) {
      console.error('Error cloning routine:', err);
      setError(err instanceof Error ? err.message : 'Failed to clone routine');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { cloneRoutine, isLoading, error };
};
