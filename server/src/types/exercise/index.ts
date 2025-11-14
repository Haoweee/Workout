import type { ExerciseType, Difficulty } from '@prisma/client';

export interface ExerciseFilters {
  search?: string;
  muscle?: string;
  equipment?: string;
  difficulty?: Difficulty;
  category?: ExerciseType;
  page?: number;
  limit?: number;
}

export interface ExerciseResponse {
  id: number;
  name: string;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: ExerciseType | null;
  level: Difficulty | null;
  force: string | null;
  mechanic: string | null;
  images: string[];
}

export interface CreateExerciseRequest {
  name: string;
  equipment?: string;
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  instructions: string[];
  category?: ExerciseType;
  level?: Difficulty;
  force?: string;
  mechanic?: string;
  images?: string[];
}

export interface UpdateExerciseRequest {
  name?: string;
  equipment?: string;
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  instructions?: string[];
  category?: ExerciseType;
  level?: Difficulty;
  force?: string;
  mechanic?: string;
  images?: string[];
}

export interface SuggestedExercises {
  name: string;
  id: number;
  equipment: string | null;
  primaryMuscles: string[];
}

// Legacy exercise types (still used in some controllers)
export interface ExerciseRequest {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

// Legacy create/update requests with different field names
export interface LegacyCreateExerciseRequest {
  name: string;
  equipment?: string;
  type?: ExerciseType;
  muscle?: string;
  difficulty?: Difficulty;
  videoUrl?: string;
  instructions?: string;
}

export interface LegacyUpdateExerciseRequest {
  name?: string;
  equipment?: string;
  type?: ExerciseType;
  muscle?: string;
  difficulty?: Difficulty;
  videoUrl?: string;
  instructions?: string;
}

// Legacy response format with exerciseId field
export interface LegacyExerciseResponse {
  id: number;
  name: string;
  force: string | null;
  level: Difficulty | null;
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string | null;
  category: ExerciseType | null;
  images: string[];
  exerciseId: string;
}
