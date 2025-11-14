import { Difficulty, Visibility, ExerciseType } from '@prisma/client';

export interface CreateRoutineRequest {
  title: string;
  description?: string;
  difficulty?: Difficulty;
  visibility: Visibility;
  exercises?: {
    exerciseId?: number;
    customExerciseName?: string;
    dayIndex: number;
    orderIndex: number;
    sets?: string;
    reps?: string;
    restSeconds?: number;
    notes?: string;
  }[];
}

export interface CreateBasicRoutineRequest {
  title: string;
  description?: string;
  difficulty?: Difficulty;
  visibility: Visibility;
}

export interface AddExerciseToRoutineRequest {
  exerciseId?: number;
  customExerciseName?: string;
  dayIndex: number;
  orderIndex?: number; // Optional - will auto-assign if not provided
  sets?: string; // Changed to string to allow "3", "3-4", "AMRAP", etc.
  reps?: string; // Changed to string to allow "8", "8-10", "To failure", etc.
  restSeconds?: number;
  notes?: string;
}

export interface RoutineResponse {
  id: string;
  title: string;
  description: string | null;
  difficulty: Difficulty | null;
  visibility: Visibility;
  createdAt: Date;
  updatedAt: Date;
  author?: {
    id: string;
    username: string;
    fullName: string;
  };
  routineExercises: {
    id: string;
    dayIndex: number;
    orderIndex: number;
    sets: string | null; // Changed to string for ranges like "3-4"
    reps: string | null; // Changed to string for ranges like "8-10"
    restSeconds: number | null;
    notes: string | null;
    customExerciseName: string | null;
    exercise: {
      id: number;
      name: string;
      equipment: string | null;
      primaryMuscles: string[];
    } | null;
  }[];
}

export interface UpdateRoutineRequest {
  title?: string;
  description?: string;
  difficulty?: Difficulty;
  visibility?: Visibility;
  exercises?: {
    exerciseId?: number;
    customExerciseName?: string;
    dayIndex: number;
    orderIndex: number;
    sets?: string;
    reps?: string;
    restSeconds?: number;
    notes?: string;
  }[];
}

export interface RoutineFilters {
  difficulty?: Difficulty;
  search?: string;
  page?: number;
  limit?: number;
  excludeUserId?: string; // Optional user ID to exclude from results
}

export interface VoteRequest {
  value: 1 | -1; // upvote or downvote
}

export interface PublicRoutineResponse {
  id: string;
  title: string;
  description: string | null;
  difficulty: Difficulty | null;
  visibility: Visibility;
  createdAt: Date;
  updatedAt: Date;
  author: {
    username: string;
    fullName: string;
  };
  _count: {
    votes: number;
    routineExercises: number;
  };
}

export interface UserRoutineResponse {
  id: string;
  title: string;
  description: string | null;
  difficulty: Difficulty | null;
  visibility: Visibility;
  createdAt: Date;
  updatedAt: Date;
  days: {
    dayIndex: number;
    exercises: {
      id: string; // RoutineExercise ID for removal
      orderIndex: number;
      sets: string | null;
      reps: string | null;
      restSeconds: number | null;
      notes: string | null;
      customExerciseName: string | null;
      exercise: {
        id: number; // Exercise ID
        name: string;
        equipment: string | null;
        primaryMuscles: string[];
        secondaryMuscles: string[];
        category: ExerciseType | null;
        level: Difficulty | null;
      } | null;
    }[];
  }[];
  totalDays: number;
  _count: {
    routineExercises: number;
    votes: number;
    workouts: number;
  };
}
