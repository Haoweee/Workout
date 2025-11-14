import { useState } from 'react';

interface ApiError {
  status?: number;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

interface UseApiOptions {
  showErrorAlert?: boolean;
  onError?: (error: ApiError) => void;
  onSuccess?: () => void;
}

export const useApi = <T>(options: UseApiOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = async (apiCall: () => Promise<T>): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
      options.onSuccess?.();
      return result;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);

      if (options.showErrorAlert) {
        // You can replace this with your preferred notification system
        console.error('API Error:', apiError.message);
      }

      options.onError?.(apiError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setData(null);
  };

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  };
};
