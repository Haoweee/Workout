import type { Routine } from '@/types/routine';
import type { DayInfo } from '@/utils/helper';
import type { useUserPreferences } from '@/hooks/user/useUserPreferences';
import type { WeightUnit } from '@/types/preferences';

export interface WorkoutAddExerciseProps {
  onAddExercise: (exerciseName: string, isCustom?: boolean) => void;
  isVisible: boolean;
  onClose: () => void;
}

export interface CompletionMessageProps {
  isVisible: boolean;
}

export interface CurrentSetFormProps {
  exercise: OptimizedExercise;
  currentSet: OptimizedSet;
  activeSetIndex: number;
  currentWeight: string;
  setCurrentWeight: (weight: string) => void;
  currentReps: string;
  setCurrentReps: (reps: string) => void;
  currentRPE: string;
  setCurrentRPE: (rpe: string) => void;
  currentNotes: string;
  setCurrentNotes: (notes: string) => void;
  saving: boolean;
  onLogSet: () => void;
  onStartRestTimer: () => void;
  showRestTimer: boolean;
}

export interface DaySelectorProps {
  routine: Routine;
  availableDays: DayInfo[];
  selectedDayIndex: number | null;
  onDaySelect: (dayIndex: number) => void;
}

export interface WorkoutsExerciseListProps {
  workout: OptimizedWorkout;
  preferences: ReturnType<typeof useUserPreferences>['preferences'];
}

export interface ExerciseNavigationProps {
  currentExerciseIndex: number;
  totalExercises: number;
  onPrevious: () => void;
  onNext: () => void;
}

export interface WorkoutHeaderProps {
  navigation: string | number;
  type?: 'default' | 'start' | 'active';
  workout?: OptimizedWorkout;
  handleQuickStart?: () => void;
  creating?: boolean;
  progress?: { completed: number; total: number; percentage: number };
  startTime?: Date;
  currentTime?: Date;
}

export interface WorkoutNotFoundProps {
  id: string;
  debugInfo: string;
  retry: () => void;
  navigate: (path: string) => void;
}

export interface WorkoutOverviewProps {
  workout: OptimizedWorkout;
  activeExerciseIndex: number;
  activeSetIndex: number;
  onExerciseClick: (exerciseIndex: number) => void;
  onWorkoutUpdate?: () => void; // Callback to refresh workout data after set removal
}

export interface RestTimerProps {
  isVisible: boolean;
  timeRemaining: number;
  isRunning: boolean;
  onToggle: () => void;
  onSkip: () => void;
}

export interface RoutineListProps {
  routines: Routine[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onRoutineSelect: (routine: Routine) => void;
  onCreateRoutine: () => void;
  creating: boolean;
}

export interface SelectedRoutineProps {
  routine: Routine;
  selectedDayIndex: number | null;
  onDaySelect: (dayIndex: number) => void;
  onStartWorkout: () => void;
  creating: boolean;
}

export interface WorkoutStatsProps {
  workout: OptimizedWorkout;
  preferences: { weightUnit: WeightUnit };
}

export interface ActiveWorkoutProps {
  workoutId: string | undefined;
}

export interface StartWorkoutProps {
  routineId: string | null;
}

export interface CreateWorkoutRequest {
  routineId?: string;
  title?: string;
  visibility?: 'PRIVATE' | 'PUBLIC' | 'UNLISTED';
  dayIndex?: number; // Add dayIndex to specify which day's exercises to include
}

export interface UpdateWorkoutRequest {
  title?: string;
  visibility?: 'PRIVATE' | 'PUBLIC' | 'UNLISTED';
  finishedAt?: string | null;
}

export interface CreateWorkoutSetRequest {
  exerciseId?: number;
  customExerciseName?: string;
  customExerciseCategory?: string;
  customExercisePrimaryMuscles?: string[];
  setNumber?: number;
  reps?: number;
  weightKg?: number;
  rpe?: number;
  durationSec?: number;
  notes?: string;
}

export interface UpdateWorkoutSetRequest {
  reps?: number;
  weightKg?: number;
  rpe?: number;
  durationSec?: number;
  notes?: string;
}

export interface Workout {
  id: string;
  userId: string;
  routineId: string | null;
  title: string | null;
  visibility: 'PRIVATE' | 'PUBLIC' | 'UNLISTED';
  startedAt: string;
  finishedAt: string | null;
  workoutSets: WorkoutSet[];
  routine?: {
    id: string;
    title: string;
  } | null;
}

export interface OptimizedSet {
  setNumber: number;
  reps: string | null;
  weightKg: number | null;
  rpe: number | null;
  notes: string | null;
  completed: boolean;
}

export interface OptimizedExercise {
  exerciseId: number | null;
  exerciseName: string;
  isCustom: boolean;
  orderIndex: number;
  sets: OptimizedSet[];
}

export interface OptimizedWorkout {
  id: string;
  userId: string;
  routineId: string | null;
  title: string | null;
  visibility: 'PRIVATE' | 'PUBLIC' | 'UNLISTED';
  startedAt: string;
  finishedAt: string | null;
  routine?: {
    id: string;
    title: string;
  } | null;
  exercises: OptimizedExercise[];
}

export interface WorkoutSet {
  id: string;
  workoutId: string;
  exerciseId: number | null;
  customExerciseName: string | null;
  customExerciseCategory: string | null;
  customExercisePrimaryMuscles: string[];
  setNumber: number;
  reps: number | null;
  weightKg: number | null;
  rpe: number | null;
  durationSec: number | null;
  notes: string | null;
  performedAt: string;
  exercise?: {
    id: number;
    name: string;
    category: string | null;
    primaryMuscles: string[];
    secondaryMuscles: string[];
  };
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalSets: number;
  totalVolume: number;
  averageWorkoutDuration: number;
  workoutsThisWeek: number;
  workoutsThisMonth: number;
}

export interface ChartDataPoint {
  month?: string;
  desktop?: number;
  muscleGroup?: string;
  exercises?: number;
}

export interface AnalyticsResponse {
  data: ChartDataPoint[];
}

export type AnalyticsType = 'overall-progress' | 'muscle-groups' | 'volume-over-time';

export interface GetUserWorkoutsOptions {
  limit?: number;
  offset?: number;
  includeFinished?: boolean;
  routineId?: string;
}

export interface GetUserWorkoutsResponse {
  workouts: Workout[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// Internal API response type for getUserWorkouts
export interface WorkoutsApiResponse {
  message: string;
  data: Workout[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}
