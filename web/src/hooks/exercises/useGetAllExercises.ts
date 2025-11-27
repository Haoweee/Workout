import { useState, useEffect, useCallback, useRef } from 'react';

import { exerciseService } from '@/services/exercises.service';

import type { ExerciseFilters, ExerciseResponse } from '@/types/exercise';

/**
 * Custom hook to fetch and manage all exercises with pagination, filtering, and searching
 * @returns An object containing exercises, pagination info, loading state, error message, and various handlers
 *
 * @example
 * const {
 *   exercises,
 *   pagination,
 *   isLoading,
 *   error,
 *   searchTerm,
 *   filters,
 *   getAllExercises,
 *   goToPage,
 *   nextPage,
 *   prevPage,
 *   applyFilters,
 *   clearFilters,
 *   updateSearchTerm,
 *   updateFilters,
 *   performSearch,
 *   handleRefresh,
 * } = useGetAllExercises();
 */
export const useGetAllExercises = () => {
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExerciseFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const currentPageRef = useRef(1);

  const getAllExercises = useCallback(
    async (
      page: number = 1,
      limit: number = 12,
      searchQuery?: string,
      exerciseFilters?: ExerciseFilters
    ): Promise<ExerciseResponse[]> => {
      setIsLoading(true);
      setError(null);
      try {
        // Build query parameters
        const queryParams: Record<string, string | number> = {
          page,
          limit,
        };

        // Add search term
        if (searchQuery && searchQuery.trim()) {
          queryParams.search = searchQuery.trim();
        }

        // Add filters
        if (exerciseFilters) {
          if (exerciseFilters.category) queryParams.category = exerciseFilters.category;
          if (exerciseFilters.level) queryParams.level = exerciseFilters.level;
          if (exerciseFilters.equipment) queryParams.equipment = exerciseFilters.equipment;
          if (exerciseFilters.force) queryParams.force = exerciseFilters.force;
          if (exerciseFilters.mechanic) queryParams.mechanic = exerciseFilters.mechanic;
          if (exerciseFilters.primaryMuscles && exerciseFilters.primaryMuscles.length > 0) {
            queryParams.primaryMuscles = exerciseFilters.primaryMuscles.join(',');
          }
        }

        const response = await exerciseService.getAllExercises(queryParams);

        setExercises(response.data);

        // Calculate hasNext and hasPrev if not provided by server
        const paginationWithCalculatedFields = {
          ...response.pagination,
          hasNext:
            response.pagination.hasNext ?? response.pagination.page < response.pagination.pages,
          hasPrev: response.pagination.hasPrev ?? response.pagination.page > 1,
        };

        setPagination(paginationWithCalculatedFields);
        currentPageRef.current = response.pagination.page;
        return response.data;
      } catch (err) {
        console.error('Failed to fetch exercises:', err);
        setError('Failed to load exercises. Please try again.');
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const goToPage = useCallback(
    (page: number) => {
      getAllExercises(page, pagination.limit, searchTerm, filters);
    },
    [getAllExercises, pagination.limit, searchTerm, filters]
  );

  const nextPage = useCallback(() => {
    getAllExercises(currentPageRef.current + 1, pagination.limit, searchTerm, filters);
  }, [getAllExercises, pagination.limit, searchTerm, filters]);

  const prevPage = useCallback(() => {
    getAllExercises(currentPageRef.current - 1, pagination.limit, searchTerm, filters);
  }, [getAllExercises, pagination.limit, searchTerm, filters]);

  const applyFilters = useCallback(() => {
    getAllExercises(1, pagination.limit, searchTerm, filters);
  }, [getAllExercises, pagination.limit, searchTerm, filters]);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
    getAllExercises(1, pagination.limit, '', {});
  }, [getAllExercises, pagination.limit]);

  const updateSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const performSearch = useCallback(() => {
    getAllExercises(1, pagination.limit, searchTerm, filters);
  }, [getAllExercises, pagination.limit, searchTerm, filters]);

  const handleRefresh = useCallback(async () => {
    try {
      await getAllExercises(pagination.page, pagination.limit, searchTerm, filters);
    } catch (err) {
      // Error is already handled by getAllExercises
      console.error('Failed to refresh exercises:', err);
    }
  }, [getAllExercises, pagination.page, pagination.limit, searchTerm, filters]);

  const updateFilters = useCallback((newFilters: ExerciseFilters) => {
    setFilters(newFilters);
  }, []);

  // Initial load effect
  useEffect(() => {
    const loadInitialExercises = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await exerciseService.getAllExercises({
          page: 1,
          limit: 12,
        });

        setExercises(response.data);
        const paginationWithCalculatedFields = {
          ...response.pagination,
          hasNext:
            response.pagination.hasNext ?? response.pagination.page < response.pagination.pages,
          hasPrev: response.pagination.hasPrev ?? response.pagination.page > 1,
        };
        setPagination(paginationWithCalculatedFields);
        currentPageRef.current = response.pagination.page;
      } catch (err) {
        console.error('Failed to fetch exercises:', err);
        setError('Failed to load exercises. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialExercises();
  }, []); // Only run on mount

  return {
    exercises,
    pagination,
    isLoading,
    error,
    searchTerm,
    filters,
    getAllExercises,
    goToPage,
    nextPage,
    prevPage,
    applyFilters,
    clearFilters,
    updateSearchTerm,
    updateFilters,
    performSearch,
    handleRefresh,
  };
};
