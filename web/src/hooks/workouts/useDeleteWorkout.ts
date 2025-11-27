import { useState } from 'react';
import type { NavigateFunction } from 'react-router-dom';

import { workoutService } from '@/services/workout.service';

/**
 * Custom hook for deleting a workout
 *
 * Features:
 * - Confirmation prompt before deletion
 * - API integration with loading states
 * - Error handling
 * - Navigation after successful deletion
 *
 * @example
 * const { deleteWorkout, isDeleting, error } = useDeleteWorkout();
 */
export const useDeleteWorkout = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteWorkout = async (id: string, navigate: NavigateFunction) => {
    if (!id || isDeleting) return;

    if (!confirm('Are you sure you want to delete this workout? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await workoutService.deleteWorkout(id);
      setIsDeleting(false);
      navigate('/workouts');
    } catch (err) {
      console.error('Error deleting workout:', err);
      setError('Failed to delete workout. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    error,
    deleteWorkout,
  };
};
