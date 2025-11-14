import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ErrorToast } from '@/components/errors/toast';

import { useUserPreferences } from '@/hooks/useUserPreferences';

import { workoutService, type OptimizedWorkout } from '@/services/workout.service';

import {
  processWorkoutData,
  parseUserWeight,
  findFirstIncompleteSet,
  getWorkoutProgress,
} from '@/utils';

interface UseActiveWorkoutProps {
  workoutId: string | undefined;
}

export const useActiveWorkout = ({ workoutId }: UseActiveWorkoutProps) => {
  // Workout state
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const [workout, setWorkout] = useState<OptimizedWorkout | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);

  // Navigation state
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [activeSetIndex, setActiveSetIndex] = useState(0);

  // Current set input state
  const [currentWeight, setCurrentWeight] = useState('');
  const [currentReps, setCurrentReps] = useState('');
  const [currentRPE, setCurrentRPE] = useState('');
  const [currentNotes, setCurrentNotes] = useState('');

  // Timer state
  const [startTime] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restTimeRemaining, setRestTimeRemaining] = useState(90);
  const [restTimerRunning, setRestTimerRunning] = useState(false);

  // Derived values
  const currentExercise = workout?.exercises?.[activeExerciseIndex] || null;
  const currentSet = currentExercise?.sets?.[activeSetIndex] || null;
  const progress = getWorkoutProgress(workout);

  // Fetch workout data
  useEffect(() => {
    const fetchWorkout = async () => {
      if (!workoutId) return;

      try {
        setLoading(true);
        const rawWorkoutData = await workoutService.getWorkoutById(workoutId);
        const processedWorkoutData = processWorkoutData(rawWorkoutData);
        setWorkout(processedWorkoutData);

        // Find the first incomplete set to start on
        const firstIncomplete = findFirstIncompleteSet(processedWorkoutData);
        if (firstIncomplete) {
          setActiveExerciseIndex(firstIncomplete.exerciseIndex);
          setActiveSetIndex(firstIncomplete.setIndex);
        }
      } catch (error) {
        console.error('Error fetching workout:', error);
        navigate(`/workouts/${workoutId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [workoutId, navigate]);

  // Timer effects
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let restTimer: ReturnType<typeof setInterval>;
    if (restTimerRunning && restTimeRemaining > 0) {
      restTimer = setInterval(() => {
        setRestTimeRemaining((prev) => {
          if (prev <= 1) {
            setRestTimerRunning(false);
            setShowRestTimer(false);
            return 90; // Reset to default
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (restTimer) clearInterval(restTimer);
    };
  }, [restTimerRunning, restTimeRemaining]);

  // Actions
  const logCurrentSet = async () => {
    if (!workout || !workoutId || !currentExercise || !currentSet) return;

    try {
      setSaving(true);

      // Create the workout set data
      const setData = {
        exerciseId: currentExercise.exerciseId || undefined,
        customExerciseName: currentExercise.isCustom ? currentExercise.exerciseName : undefined,
        setNumber: currentSet.setNumber,
        reps: currentReps ? parseInt(currentReps) : undefined,
        weightKg: parseUserWeight(currentWeight, preferences) || undefined,
        rpe: currentRPE ? parseInt(currentRPE) : undefined,
        notes: currentNotes || undefined,
      };

      // Call the API to add the workout set
      await workoutService.addWorkoutSet(workoutId, setData);

      // Update local state optimistically
      setWorkout((prev) => {
        if (!prev) return prev;

        const newWorkout = { ...prev };
        newWorkout.exercises = [...(prev.exercises ?? [])];
        newWorkout.exercises[activeExerciseIndex] = {
          ...newWorkout.exercises[activeExerciseIndex],
          sets: [...(newWorkout.exercises[activeExerciseIndex].sets ?? [])],
        };

        const targetSet = newWorkout.exercises[activeExerciseIndex].sets[activeSetIndex];
        newWorkout.exercises[activeExerciseIndex].sets[activeSetIndex] = {
          ...targetSet,
          reps: setData.reps?.toString() || null,
          weightKg: setData.weightKg || null,
          rpe: setData.rpe || null,
          notes: setData.notes || null,
          completed: true,
        };

        return processWorkoutData(newWorkout);
      });

      // Clear inputs
      clearSetInputs();

      // Move to next set or exercise
      moveToNextSet();

      // Check if workout is complete after this set
      const updatedWorkout = processWorkoutData({
        ...workout,
        exercises: workout.exercises?.map((ex, idx) => {
          if (idx === activeExerciseIndex) {
            return {
              ...ex,
              sets: ex.sets.map((s, sIdx) => {
                if (sIdx === activeSetIndex) {
                  return {
                    ...s,
                    reps: setData.reps?.toString() || null,
                    weightKg: setData.weightKg || null,
                    rpe: setData.rpe || null,
                    notes: setData.notes || null,
                    completed: true,
                  };
                }
                return s;
              }),
            };
          }
          return ex;
        }),
      });

      const updatedProgress = getWorkoutProgress(updatedWorkout);

      if (updatedProgress.completed === updatedProgress.total && updatedProgress.total > 0) {
        // All sets completed, show completion message then automatically finish workout
        setShowCompletionMessage(true);
        setTimeout(() => {
          finishWorkout();
        }, 2000); // 2 second delay to show completion message
      } else {
        // Start rest timer only if workout isn't finished
        startRestTimer();
      }
    } catch (error) {
      console.error('Error saving set:', error);
      ErrorToast({
        message: 'Error saving set',
        description: 'An error occurred while trying to save your set. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const moveToNextSet = () => {
    if (!currentExercise || !workout) return;

    if (activeSetIndex < currentExercise.sets.length - 1) {
      // Move to next set in current exercise
      setActiveSetIndex(activeSetIndex + 1);
    } else if (activeExerciseIndex < (workout.exercises?.length ?? 0) - 1) {
      // Move to first set of next exercise
      setActiveExerciseIndex(activeExerciseIndex + 1);
      setActiveSetIndex(0);
    }
    // If we're at the last set of the last exercise, stay there
  };

  const startRestTimer = () => {
    setShowRestTimer(true);
    setRestTimeRemaining(90);
    setRestTimerRunning(true);
  };

  const toggleRestTimer = () => {
    setRestTimerRunning(!restTimerRunning);
  };

  const skipRestTimer = () => {
    setShowRestTimer(false);
    setRestTimerRunning(false);
    setRestTimeRemaining(90);
  };

  const finishWorkout = async () => {
    if (!workout || !workoutId) return;

    try {
      setFinishing(true);
      setShowCompletionMessage(false); // Hide completion message when manually finishing

      // Call API to finish the workout
      await workoutService.finishWorkout(workoutId);

      // Navigate to workout detail page
      navigate(`/workouts/${workoutId}`);
    } catch (error) {
      console.error('Error finishing workout:', error);
      ErrorToast({
        message: 'Error finishing workout',
        description: 'An error occurred while trying to finish your workout. Please try again.',
      });
    } finally {
      setFinishing(false);
    }
  };

  const clearSetInputs = () => {
    setCurrentWeight('');
    setCurrentReps('');
    setCurrentRPE('');
    setCurrentNotes('');
  };

  const navigateToExercise = (exerciseIndex: number) => {
    setActiveExerciseIndex(exerciseIndex);
    setActiveSetIndex(0);
  };

  const navigateToPrevExercise = () => {
    if (activeExerciseIndex > 0) {
      setActiveExerciseIndex(activeExerciseIndex - 1);
      setActiveSetIndex(0);
    }
  };

  const navigateToNextExercise = () => {
    if (workout && activeExerciseIndex < (workout.exercises?.length ?? 0) - 1) {
      setActiveExerciseIndex(activeExerciseIndex + 1);
      setActiveSetIndex(0);
    }
  };

  return {
    // State
    workout,
    loading,
    saving,
    finishing,
    showCompletionMessage,
    activeExerciseIndex,
    activeSetIndex,
    currentWeight,
    setCurrentWeight,
    currentReps,
    setCurrentReps,
    currentRPE,
    setCurrentRPE,
    currentNotes,
    setCurrentNotes,
    startTime,
    currentTime,
    showRestTimer,
    restTimeRemaining,
    restTimerRunning,

    // Derived values
    currentExercise,
    currentSet,
    progress,

    // Actions
    logCurrentSet,
    startRestTimer,
    toggleRestTimer,
    skipRestTimer,
    finishWorkout,
    clearSetInputs,
    navigateToExercise,
    navigateToPrevExercise,
    navigateToNextExercise,
  };
};
