import { useState, useEffect } from 'react';
import { routineService } from '@/services';
import type { Routine } from '@/types/api';

export const useGetPublicRoutines = () => {
  const [publicRoutines, setPublicRoutines] = useState<Routine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchPublicRoutines = async (params?: {
    page?: number;
    limit?: number;
    difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    search?: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await routineService.getPublicRoutines(params);
      setPublicRoutines(response.data);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        total: response.pagination.total,
        pages: response.pagination.pages,
        hasNext: response.pagination.hasNext ?? false,
        hasPrev: response.pagination.hasPrev ?? false,
      });
    } catch (err) {
      console.error('Error fetching public routines:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch public routines');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicRoutines();
  }, []);

  return {
    publicRoutines,
    isLoading,
    error,
    pagination,
    fetchPublicRoutines,
  };
};
