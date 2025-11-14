import {
  User,
  Exercise,
  Routine,
  Workout,
  Visibility,
  ExerciseType,
  Difficulty,
} from '@prisma/client';

// Re-export Prisma types for external usage
export { User, Exercise, Routine, Workout, Visibility, ExerciseType, Difficulty };

// Re-export all types from organized modules
export * from './auth';
export * from './exercise';
export * from './routine';
export * from './user';
export * from './workout';
export * from './common';
