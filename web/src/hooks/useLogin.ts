import { useNavigate, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi';
import type { LoginRequest } from '@/types/api';
import { logger } from '@/lib/logger';

/**
 * Custom hook for login functionality
 *
 * Handles all login-related business logic:
 * - Form submission
 * - Navigation after login
 * - Error handling
 * - Loading states
 */
export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state, default to dashboard
  const from = location.state?.from || '/profile?tab=workouts';

  // Memoize the options to prevent useApi from being recreated on every render
  const apiOptions = useMemo(
    () => ({
      onSuccess: () => {
        // Small delay to ensure auth context is updated before navigation
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 100);
      },

      onError: (err: { message: string }) => {
        logger.error('Login failed:', err.message);
      },
    }),
    [navigate, from]
  );

  const { isLoading, error, execute } = useApi(apiOptions);

  const handleLogin = async (credentials: LoginRequest) => {
    await execute(() => login(credentials));
  };

  return {
    handleLogin,
    isLoading,
    error,
  };
};
