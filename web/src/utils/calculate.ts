import { type OptimizedWorkout, type Workout } from '@/services/workout.service';
import { type WeightUnit } from '@/types/preferences';

// Weight conversion utilities
export const convertWeight = (weight: number, fromUnit: WeightUnit, toUnit: WeightUnit): number => {
  if (fromUnit === toUnit) return weight;

  if (fromUnit === 'kg' && toUnit === 'lbs') {
    return Number((weight * 2.20462).toFixed(1));
  }

  if (fromUnit === 'lbs' && toUnit === 'kg') {
    return Number((weight / 2.20462).toFixed(1));
  }

  return weight;
};

// Format weight with unit
export const formatWeight = (weight: number, unit: WeightUnit): string => {
  return `${weight} ${unit}`;
};

// Get weight unit label
export const getWeightUnitLabel = (unit: WeightUnit): string => {
  return unit === 'kg' ? 'Kilograms' : 'Pounds';
};

export const calculateWorkoutDuration = (workout: OptimizedWorkout | Workout): number => {
  if (!workout.finishedAt) return 0;
  const start = new Date(workout.startedAt).getTime();
  const end = new Date(workout.finishedAt).getTime();
  return Math.floor((end - start) / 1000);
};

export const calculateTotalVolume = (
  preferences: { weightUnit: WeightUnit },
  workout: OptimizedWorkout
): number | undefined => {
  return workout.exercises?.reduce((total, exercise) => {
    return (
      total +
      exercise.sets.reduce((exerciseTotal, set) => {
        if (set.weightKg && set.reps) {
          // Convert weight to user's preferred unit for volume calculation
          const userWeight = convertWeight(set.weightKg, 'kg', preferences.weightUnit);
          return exerciseTotal + userWeight * Number(set.reps);
        }
        return exerciseTotal;
      }, 0)
    );
  }, 0);
};
