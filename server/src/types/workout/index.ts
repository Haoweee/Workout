import { Difficulty, ExerciseType, Visibility } from '@prisma/client';

export interface WorkoutExerciseCompletionRequest {
  sets?: {
    reps: number;
    weight?: number;
    duration?: number; // in seconds for timed exercises
    distance?: number; // in meters for cardio
    completed: boolean;
  }[];
}

export interface CreateWorkoutRequest {
  routineId: string;
  visibility?: Visibility;
  dayIndex?: number;
  title?: string;
  notes?: string;
  scheduledDate?: Date;
}

export interface CreateWorkoutInput {
  routineId?: string;
  title?: string;
  visibility?: Visibility;
  dayIndex?: number; // Add dayIndex to specify which day's exercises to include
}

export interface WorkoutResponse {
  id: string;
  title: string;
  notes: string | null;
  startTime: Date | null;
  endTime: Date | null;
  duration: number | null; // in seconds
  scheduledDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  routine: {
    id: string;
    title: string;
    difficulty: Difficulty | null;
  };
  workoutExercises: {
    id: string;
    dayIndex: number;
    orderIndex: number;
    isCompleted: boolean;
    notes: string | null;
    exercise: {
      id: number;
      name: string;
      equipment: string | null;
      primaryMuscles: string[];
      category: ExerciseType | null;
    };
    plannedSets: string | null;
    plannedReps: string | null;
    plannedRestSeconds: number | null;
    completedSets: {
      id: string;
      reps: number;
      weight: number | null;
      duration: number | null;
      distance: number | null;
      completed: boolean;
      orderIndex: number;
    }[];
  }[];
}

export interface WorkoutSummaryResponse {
  id: string;
  title: string;
  notes: string | null;
  startTime: Date | null;
  endTime: Date | null;
  duration: number | null;
  scheduledDate: Date | null;
  createdAt: Date;
  routine: {
    id: string;
    title: string;
    difficulty: Difficulty | null;
  };
  _count: {
    workoutExercises: number;
  };
  completionRate: number; // percentage of completed exercises
}

export interface UpdateWorkoutRequest {
  title?: string;
  visibility?: Visibility;
  finishedAt?: Date | null;
}

export interface UpdateWorkoutSet {
  reps?: number;
  weightKg?: number;
  rpe?: number;
  durationSec?: number;
  notes?: string;
}

export interface WorkoutFilters {
  routineId?: string;
  startDate?: Date;
  endDate?: Date;
  completed?: boolean;
  page?: number;
  limit?: number;
}

// Legacy workout types (still used in some controllers)
export interface WorkoutSessionRequest {
  routineId?: string;
  title?: string;
  visibility?: Visibility;
}

export interface WorkoutSetRequest {
  exerciseId: number;
  setNumber: number;
  reps?: number;
  weightKg?: number;
  rpe?: number;
  durationSec?: number;
  notes?: string;
}

export interface AddWorkoutSetRequest {
  exerciseId: number;
  customExerciseName?: string;
  customExerciseCategory?: string;
  customExercisePrimaryMuscles?: string[];
  setNumber: number;
  reps?: number;
  weightKg?: number;
  rpe?: number;
  durationSec?: number;
  notes?: string;
}
