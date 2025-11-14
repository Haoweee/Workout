import { useState, useEffect } from 'react';
import type { NavigateFunction } from 'react-router-dom';

import { ErrorToast } from '@/components/errors/toast';

import { workoutService, type OptimizedWorkout } from '@/services/workout.service';

export const useGetWorkoutById = (id: string | undefined, navigate: NavigateFunction) => {
  const [workout, setWorkout] = useState<OptimizedWorkout | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const loadWorkout = async () => {
      if (!id) {
        console.error('No workout ID provided');
        setDebugInfo('No workout ID provided in URL parameters');
        setLoading(false);
        return;
      }

      setDebugInfo(`Loading workout with ID: ${id}`);

      try {
        const workoutData = await workoutService.getWorkoutById(id);
        setDebugInfo(`Workout loaded successfully: ${workoutData.title || 'Untitled'}`);
        setWorkout(workoutData);
      } catch (error) {
        console.error('Error fetching workout:', error);

        let errorMessage = 'Unknown error occurred';
        let statusCode = 'Unknown';

        if (error && typeof error === 'object') {
          if ('status' in error) {
            statusCode = String(error.status);
            if (error.status === 404) {
              errorMessage =
                'Workout not found (404). It may have been deleted or you may not have access to it.';
            } else if (error.status === 401) {
              errorMessage =
                'You are not authorized to view this workout (401). Please log in again.';
            } else {
              const errorMsg = 'message' in error ? String(error.message) : 'Unknown error';
              errorMessage = `Server error (${statusCode}): ${errorMsg}`;
            }
          } else if ('message' in error) {
            errorMessage = String(error.message);
          }
        }

        setDebugInfo(`Error loading workout: ${errorMessage}`);

        // Handle different error types
        if (error && typeof error === 'object' && 'status' in error) {
          if (error.status === 404) {
            ErrorToast({
              message: 'Workout Not Found',
              description:
                'The requested workout could not be found. It may have been deleted or you may not have access to it.',
            });
          } else if (error.status === 401) {
            ErrorToast({
              message: 'Unauthorized Access',
              description: 'You are not authorized to view this workout. Please log in again.',
            });
          } else {
            const errorMsg = 'message' in error ? String(error.message) : 'Unknown error';
            ErrorToast({
              message: 'Error Loading Workout',
              description: `Failed to load workout: ${errorMsg}`,
            });
          }
        } else {
          ErrorToast({
            message: 'Error Loading Workout',
            description: 'Failed to load workout. Please check your connection and try again.',
          });
        }

        // Give user option to stay or go back
        if (confirm('Would you like to go back to the workouts list?')) {
          navigate('/workouts');
        }
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [id, navigate]);

  return {
    workout,
    isLoading: loading,
    debugInfo,
    // Helper method to handle retry
    retry: () => {
      setLoading(true);
      setWorkout(null);
      // The useEffect will run again due to the loading state change
    },
  };
};
