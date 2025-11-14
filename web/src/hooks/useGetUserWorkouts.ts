import { useState, useEffect } from 'react';
import { type Workout, workoutService } from '@/services/workout.service';

export const useGetUserWorkouts = (limit: number) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

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
        console.warn('Unexpected API response structure:', response);
        setWorkouts([]);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError(error instanceof Error ? error : new Error('Unknown error'));
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  return { workouts, isLoading, error };
};
