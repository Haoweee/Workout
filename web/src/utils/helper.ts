import type { OptimizedExercise, OptimizedSet, OptimizedWorkout } from '@/services/workout.service';
import type { Routine } from '@/types/api';
import { type WeightUnit } from '@/types/preferences';
import { convertWeight } from '@/utils/calculate';

export interface DayInfo {
  dayIndex: number;
  name: string;
  exerciseCount: number;
}

export interface ExerciseInfo {
  exercise?: { name?: string };
  customExerciseName?: string;
  sets?: string;
  reps?: string;
}

export const DAYS_OF_WEEK = [
  'Day 1',
  'Day 2',
  'Day 3',
  'Day 4',
  'Day 5',
  'Day 6',
  'Day 7',
] as const;

// Get color classes based on difficulty level
export const getDifficultyColor = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Weight conversion helpers
export const displayWeight = (
  weightKg: number | null | undefined,
  preferences: { weightUnit: WeightUnit }
): string => {
  if (!weightKg) return '-';
  const userWeight = convertWeight(weightKg, 'kg', preferences.weightUnit);
  return userWeight.toString();
};

// Helper function to get unique sets (remove duplicates, prefer completed ones)
export const getUniqueSets = (sets: OptimizedWorkout['exercises'][0]['sets']) => {
  return sets.reduce(
    (uniqueSets, set) => {
      const existingIndex = uniqueSets.findIndex(
        (existing) => existing.setNumber === set.setNumber
      );

      if (existingIndex === -1) {
        // No existing set with this number, add it
        uniqueSets.push(set);
      } else {
        // Set with this number exists, keep the completed one
        const existing = uniqueSets[existingIndex];
        if (set.completed && !existing.completed) {
          uniqueSets[existingIndex] = set;
        }
      }

      return uniqueSets;
    },
    [] as typeof sets
  );
};

// Process workout data to remove duplicate sets
export const processWorkoutData = (workoutData: OptimizedWorkout): OptimizedWorkout => {
  return {
    ...workoutData,
    exercises: workoutData.exercises.map((exercise) => ({
      ...exercise,
      sets: getUniqueSets(exercise.sets).sort((a, b) => a.setNumber - b.setNumber),
    })),
  };
};

export const parseUserWeight = (
  weightInput: string,
  preferences: { weightUnit: WeightUnit }
): number | null => {
  const weight = parseFloat(weightInput);
  if (isNaN(weight)) return null;
  // Convert user input back to kg for storage
  return convertWeight(weight, preferences.weightUnit, 'kg');
};

const getCurrentExercise = (
  workout: OptimizedWorkout,
  activeExerciseIndex: number
): OptimizedExercise | null => {
  if (!workout || !workout.exercises[activeExerciseIndex]) return null;
  return workout.exercises[activeExerciseIndex];
};

export const getCurrentSet = (
  workout: OptimizedWorkout,
  activeExerciseIndex: number,
  activeSetIndex: number
): OptimizedSet | null => {
  const exercise = getCurrentExercise(workout, activeExerciseIndex);
  if (!exercise || !exercise.sets[activeSetIndex]) return null;
  return exercise.sets[activeSetIndex];
};

export const getWorkoutProgress = (
  workout: OptimizedWorkout | null
): {
  completed: number;
  total: number;
  percentage: number;
} => {
  if (!workout) return { completed: 0, total: 0, percentage: 0 };

  let completed = 0;
  let total = 0;

  workout.exercises.forEach((exercise) => {
    exercise.sets.forEach((set) => {
      total++;
      if (set.completed) completed++;
    });
  });

  return {
    completed,
    total,
    percentage: total > 0 ? (completed / total) * 100 : 0,
  };
};

export const findFirstIncompleteSet = (
  workout: OptimizedWorkout
): { exerciseIndex: number; setIndex: number } | null => {
  for (let exerciseIndex = 0; exerciseIndex < workout.exercises.length; exerciseIndex++) {
    const exercise = workout.exercises[exerciseIndex];
    for (let setIndex = 0; setIndex < exercise.sets.length; setIndex++) {
      if (!exercise.sets[setIndex].completed) {
        return { exerciseIndex, setIndex };
      }
    }
  }
  return null;
};

export interface AvailableDay {
  name: string;
  exerciseCount: number;
  dayIndex: number;
}

/**
 * Get exercises for a specific day from a routine
 */
export const getDayExercises = (routine: Routine, dayIndex: number): ExerciseInfo[] => {
  // Handle UserRoutineResponse structure (has 'days' array)
  if ('days' in routine && Array.isArray(routine.days)) {
    const day = routine.days.find((d) => d.dayIndex === dayIndex);

    return (day?.exercises || []).map(
      (ex: ExerciseInfo): ExerciseInfo => ({
        exercise: ex.exercise ? { name: ex.exercise.name } : undefined,
        customExerciseName: ex.customExerciseName ?? undefined,
        sets: ex.sets !== undefined ? String(ex.sets) : undefined,
        reps: ex.reps !== undefined ? String(ex.reps) : undefined,
      })
    );
  }

  // Handle RoutineResponse structure (has 'routineExercises' array)
  if ('routineExercises' in routine && Array.isArray(routine.routineExercises)) {
    return routine.routineExercises
      .filter((ex) => ex.dayIndex === dayIndex)
      .map((ex) => ({
        exercise: ex.exercise ? { name: ex.exercise.name } : undefined,
        customExerciseName: ex.customExerciseName ?? undefined,
        sets: ex.sets !== undefined ? String(ex.sets) : undefined,
        reps: ex.reps !== undefined ? String(ex.reps) : undefined,
      }));
  }

  return [];
};

/**
 * Get available days from a routine
 */
export const getAvailableDays = (routine: Routine): DayInfo[] => {
  // Handle UserRoutineResponse structure (has 'days' array)
  if ('days' in routine && Array.isArray(routine.days)) {
    return routine.days
      .filter((day) => day.exercises && day.exercises.length > 0)
      .map((day) => ({
        dayIndex: day.dayIndex,
        name: DAYS_OF_WEEK[day.dayIndex],
        exerciseCount: day.exercises.length,
      }))
      .sort((a, b) => a.dayIndex - b.dayIndex);
  }

  // Handle RoutineResponse structure (has 'routineExercises' array)
  if ('routineExercises' in routine && Array.isArray(routine.routineExercises)) {
    const dayIndices = [...new Set(routine.routineExercises.map((ex) => ex.dayIndex))];
    return dayIndices.sort().map((dayIndex) => ({
      dayIndex,
      name: DAYS_OF_WEEK[dayIndex],
      exerciseCount: routine.routineExercises!.filter((ex) => ex.dayIndex === dayIndex).length,
    }));
  }

  return [];
};

/**
 * Get total exercise count from a routine
 */
export const getTotalExerciseCount = (routine: Routine): number => {
  // Handle UserRoutineResponse structure (has 'days' array)
  if ('days' in routine && Array.isArray(routine.days)) {
    return routine.days.reduce((total, day) => total + day.exercises.length, 0);
  }

  // Handle RoutineResponse structure (has 'routineExercises' array)
  if ('routineExercises' in routine && Array.isArray(routine.routineExercises)) {
    return routine.routineExercises.length;
  }

  return 0;
};

/**
 * Filter routines by search term
 */
export const filterRoutines = (routines: Routine[], searchTerm: string): Routine[] => {
  if (!searchTerm.trim()) return routines;

  return routines.filter((routine) =>
    routine.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

/**
 * Get exercise display name
 */
export const getExerciseName = (exercise: ExerciseInfo): string => {
  return exercise.exercise?.name || exercise.customExerciseName || 'Unknown Exercise';
};

/**
 * Format exercise sets and reps
 */
export const formatExerciseInfo = (exercise: ExerciseInfo): string => {
  if (exercise.sets && exercise.reps) {
    return `${exercise.sets} × ${exercise.reps}`;
  }
  return 'Custom';
};
