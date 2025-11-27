import type { Exercise } from './exercise';

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

export interface RoutineBasicInfoProps {
  title: string;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  visibility: 'PUBLIC' | 'PRIVATE' | '';
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDifficultyChange: (value: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') => void;
  onVisibilityChange: (value: 'PUBLIC' | 'PRIVATE') => void;
}

export interface CreateRoutineRequest {
  title: string;
  description?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  visibility: 'PUBLIC' | 'PRIVATE';
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

export interface CreateRoutineResponse {
  createRoutine: (data: CreateRoutineRequest) => Promise<Routine | null>;
  isLoading: boolean;
  createError: string | null;
  success: boolean;
  reset: () => void;
}

export interface RoutineResponse {
  routine: Routine | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface Day {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface DayTabsProps {
  days: Day[];
  currentDayId: string;
  onDaySelect: (dayId: string) => void;
  onAddDay: () => void;
  onRemoveDay: (dayId: string) => void;
}

export interface ExerciseBuilderProps {
  days: Day[];
  currentDayId: string;
  onDaysChange: (days: Day[]) => void;
  onCurrentDayChange: (dayId: string) => void;
  onAddExercise: (exerciseName: string, isCustom?: boolean) => void;
  onUpdateExercise: (exerciseId: string | number, field: string, value: string) => void;
  onRemoveExercise: (exerciseId: string | number) => void;
  onAddDay: () => void;
  onRemoveDay: (dayId: string) => void;
  onShowTemplates: () => void;
}

export interface ExerciseListProps {
  currentDay: Day | null;
  onUpdateExercise: (exerciseId: string | number, field: string, value: string) => void;
  onRemoveExercise: (exerciseId: string | number) => void;
}

export interface ExerciseSearchProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onAddExercise: (name: string, isCustom?: boolean) => void;
}

export interface RoutineHeaderProps {
  routine?: Routine;
  showAvatar?: boolean;
  navigation?: string;
}

export interface RoutineFormProps {
  mode: 'create' | 'edit';
  existingRoutine?: Routine;
  onSuccess?: (routine: Routine) => void;
}

export interface RoutineFormData {
  title: string;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  visibility: 'PUBLIC' | 'PRIVATE' | '';
}

export interface TemplateSelectorProps {
  onTemplateSelect: (templateId: string) => void;
  onStartFromScratch: () => void;
}

export interface RoutineDeleteProps {
  routine: Routine;
  showDeleteDialog: boolean;
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UpdateRoutineRequest {
  title: string;
  description?: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  visibility: 'PUBLIC' | 'PRIVATE';
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
