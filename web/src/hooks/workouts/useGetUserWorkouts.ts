import { useState, useEffect } from 'react';

import { workoutService } from '@/services/workout.service';

import type { Workout } from '@/types/workout';

import { logger } from '@/lib/logger';

/**
 * Custom hook to fetch a list of user workouts
 * @param limit Number of workouts to fetch
 * @returns An object containing the workouts, loading state, and any error encountered
 *
 * @example
 * const { workouts, isLoading, error } = useGetUserWorkouts(10);
 */
export const useGetUserWorkouts = (limit: number) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);

        const response = await workoutService.getUserWorkouts({
          limit: limit,
          offset: 0,
          includeFinished: true,
        });

        // Ensure response has the expected structure
        if (response && response.workouts && Array.isArray(response.workouts)) {
          setWorkouts(response.workouts);
        } else {
          logger.warn('Unexpected API response structure:', response);
          setWorkouts([]);
        }
      } catch (error) {
        logger.error('Error fetching workouts:', error);
        setError(error instanceof Error ? error : new Error('Unknown error'));
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [limit]);

  return { workouts, isLoading, error };
};
