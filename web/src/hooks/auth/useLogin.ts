import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { authService } from '@/services';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state, default to dashboard
  const from = location.state?.from || '/profile?tab=workouts';

  const handleLogin = async (credentials: LoginRequest) => {
    setError(null);
    setIsLoading(true);
    try {
      await authService.login(credentials);
      // Small delay to ensure auth context is updated before navigation
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 100);
    } catch (err) {
      logger.error('Login failed:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleLogin,
    isLoading,
    error,
  };
};
