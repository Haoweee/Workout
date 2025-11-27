export interface Exercise {
  id: string | number;
  name: string;
  sets?: string;
  reps?: string;
  rest?: string;
  notes?: string;
  isCustom?: boolean;
  description?: string;
  type?: 'STRENGTH' | 'CARDIO' | 'MOBILITY';
  equipment?: string;
  targetMuscles?: string[];
  instructions?: string[];
}

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

export interface ExerciseDetailCardProps {
  exercise: ExerciseResponse;
}

export interface ExerciseToolbarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearch: () => void;
  filters: ExerciseFilters;
  onFiltersChange: (filters: ExerciseFilters) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  isLoading: boolean;
  handleRefresh: () => void;
  error: string | null;
  suggestions?: Array<{ id: string | number; name: string }>;
  showDropdown?: boolean;
  onSuggestionClick?: (suggestion: { id: string | number; name: string }) => void;
}

export interface FilterOptions {
  categories: string[];
  levels: string[];
  muscleGroups: string[];
  equipmentTypes: string[];
  forceTypes: string[];
  mechanicTypes: string[];
}

export interface ExerciseFilters {
  category?: string;
  level?: string;
  primaryMuscles?: string[];
  equipment?: string;
  force?: string;
  mechanic?: string;
}

export interface ExerciseFiltersProps {
  filters: ExerciseFilters;
  onFiltersChange: (filters: ExerciseFilters) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export interface ExercisePaginationProps {
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  pagination: {
    page: number;
    pages: number;
    hasPrev: boolean;
    hasNext: boolean;
    limit: number;
    total: number;
  };
}
