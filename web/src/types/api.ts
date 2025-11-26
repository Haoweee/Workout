// API Type Definitions
// Based on your backend Swagger documentation

// Base response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  type?: 'register' | 'changePassword';
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    username: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

// User types
export interface User {
  id: string;
  email: string;
  fullName: string;
  username: string;
  avatarUrl?: string;
  bio?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  hasPassword: boolean;
  providers?: {
    provider: string;
    providerId: string;
  }[];
}

export interface UpdateProfileRequest {
  fullName?: string;
  username?: string;
  bio?: string;
}

// Routine types
export interface Routine {
  id: string;
  title: string;
  description?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  visibility: 'PUBLIC' | 'PRIVATE';
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: {
    username: string;
    fullName: string;
    avatarUrl?: string;
  };
  routineExercises?: {
    id: string;
    routineId: string;
    exerciseId: string | null;
    customExerciseName: string | null;
    dayIndex: number;
    orderIndex: number;
    sets: string | null;
    reps: string | null;
    restSeconds: number | null;
    notes: string | null;
    exercise: {
      id: string;
      name: string;
      force: string | null;
      mechanic: string | null;
      equipment: string | null;
      primaryMuscles: string[];
      secondaryMuscles: string[];
      instructions: string[];
      category: 'STRENGTH' | 'CARDIO' | 'MOBILITY' | null;
      images: string[];
      exerciseId: string;
    } | null;
  }[];
  _count?: {
    votes?: number;
    workouts?: number;
  };
}

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  type: 'STRENGTH' | 'CARDIO' | 'MOBILITY';
  equipment?: string;
  targetMuscles: string[];
  instructions?: string[];
}

// Exercise API Response (matches server structure)
export interface ExerciseResponse {
  id: number;
  name: string;
  equipment: string | null;
  category: 'STRENGTH' | 'CARDIO' | 'MOBILITY' | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | null;
  force: string | null;
  mechanic: string | null;
  images: string[];
  instructions: string;
  exerciseId: string;
}

export interface CreateRoutineRequest {
  title: string;
  description?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  visibility: 'PUBLIC' | 'PRIVATE';
  exercises?: Exercise[]; // Can be empty array or omitted
}

// Health check type
export interface HealthResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version?: string;
}
