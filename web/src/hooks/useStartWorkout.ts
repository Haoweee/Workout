import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutService } from '@/services/workout.service';
import { ErrorToast } from '@/components/errors/toast';
import { useRoutine } from '@/hooks/useRoutine';
import { useRoutines } from '@/hooks/useRoutines';
import { getAvailableDays } from '@/utils';
import type { Routine } from '@/types/api';

interface UseStartWorkoutProps {
  routineId: string | null;
}

export const useStartWorkout = ({ routineId }: UseStartWorkoutProps) => {
  const navigate = useNavigate();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  // Fetch all user routines
  const { routines: allRoutines, isLoading: routinesLoading, error: routinesError } = useRoutines();

  // Fetch specific routine if routineId is provided
  const {
    routine: specificRoutine,
    isLoading: specificRoutineLoading,
    error: specificRoutineError,
  } = useRoutine(routineId || undefined);

  // Determine which routines to use and loading state
  const routines = useMemo(() => {
    return routineId ? (specificRoutine ? [specificRoutine] : []) : allRoutines;
  }, [routineId, specificRoutine, allRoutines]);

  const routineLoading = routineId ? specificRoutineLoading : routinesLoading;
  const routineError = routineId ? specificRoutineError : routinesError;

  // Handle routine selection
  const handleRoutineSelect = useCallback((routine: Routine) => {
    setSelectedRoutine(routine);
    setSelectedDayIndex(null);

    // If routine only has one day, auto-select it
    const availableDays = getAvailableDays(routine);
    if (availableDays.length === 1) {
      setSelectedDayIndex(availableDays[0].dayIndex);
    }
  }, []);

  // Auto-select routine from URL parameter
  useEffect(() => {
    if (routines && routines.length > 0 && routineId) {
      const foundRoutine = routines.find((r) => r.id === routineId);
      if (foundRoutine) {
        handleRoutineSelect(foundRoutine);
      }
    }
  }, [routineId, routines, handleRoutineSelect]);

  // Start workout with or without routine
  const handleStartWorkout = useCallback(
    async (routine?: Routine, dayIndex?: number) => {
      if (creating) return;

      setCreating(true);
      try {
        const workout = await workoutService.createWorkout({
          routineId: routine?.id,
          title: routine ? `${routine.title} - ${new Date().toLocaleDateString()}` : undefined,
          visibility: 'PRIVATE',
          dayIndex,
        });

        // Navigate to active workout page
        navigate(`/workouts/${workout.id}/active`);
      } catch (error) {
        console.error('Error creating workout:', error);
        ErrorToast({
          message: 'Error Starting Workout',
          description: 'An error occurred while trying to start your workout. Please try again.',
        });
      } finally {
        setCreating(false);
      }
    },
    [creating, navigate]
  );

  // Start workout with selected routine
  const handleStartRoutineWorkout = useCallback(() => {
    if (!selectedRoutine) return;

    const availableDays = getAvailableDays(selectedRoutine);
    if (availableDays.length === 1) {
      // Single day routine - start immediately
      handleStartWorkout(selectedRoutine, availableDays[0].dayIndex);
    } else if (selectedDayIndex !== null) {
      // Multi-day routine with day selected
      handleStartWorkout(selectedRoutine, selectedDayIndex);
    } else {
      // Multi-day routine without day selected - show error
      ErrorToast({
        message: 'No Day Selected',
        description: 'Please select a day to start your workout.',
      });
    }
  }, [selectedRoutine, selectedDayIndex, handleStartWorkout]);

  // Quick start without routine
  const handleQuickStart = useCallback(() => {
    handleStartWorkout();
  }, [handleStartWorkout]);

  // Clear selection
  const clearSelection = useCallback(() => {
    setSelectedRoutine(null);
    setSelectedDayIndex(null);
  }, []);

  return {
    // State
    searchTerm,
    setSearchTerm,
    selectedRoutine,
    selectedDayIndex,
    setSelectedDayIndex,
    creating,

    // Data
    routines: Array.isArray(routines) ? routines : routines ? [routines] : [],
    routineLoading,
    routineError,

    // Actions
    handleRoutineSelect,
    handleStartRoutineWorkout,
    handleQuickStart,
    clearSelection,
  };
};
