import { useState, useEffect, useCallback } from 'react';
import { routineService } from '@/services/routine.service';
import type { Routine } from '@/types/routine';

/**
 * Custom hook for managing user routines
 *
 * Provides functionality for:
 * - Fetching user routines
 * - Loading states
 * - Error handling
 * - Refresh functionality
 *
 * @param autoFetch - Whether to automatically fetch routines on mount (default: true)
 */
export const useGetAllUserRoutines = (autoFetch: boolean = true) => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const fetchUserRoutines = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const userRoutines = await routineService.getUserRoutines();
      setRoutines(userRoutines);
      setHasInitialized(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch routines';
      setError(errorMessage);
      console.error('Error fetching user routines:', err);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array since it doesn't depend on any props/state

  const refreshRoutines = useCallback(() => {
    fetchUserRoutines();
  }, [fetchUserRoutines]);

  // Fetch routines on hook initialization only if autoFetch is true
  useEffect(() => {
    if (autoFetch) {
      fetchUserRoutines();
    }
  }, [autoFetch, fetchUserRoutines]);

  return {
    routines,
    isLoading,
    error,
    hasInitialized,
    refreshRoutines,
    fetchUserRoutines, // Expose for manual triggering
    refetch: fetchUserRoutines, // Alias for fetchUserRoutines
  };
};
