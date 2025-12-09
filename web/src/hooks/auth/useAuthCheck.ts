import { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';

/**
 * Lightweight auth state checker
 * Uses actual auth service to check authentication status
 */
export const useAuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const authenticated = await authService.isAuthenticated();
      console.log('useAuthCheck - isAuthenticated:', authenticated);
      setIsAuthenticated(authenticated);
    } catch (error) {
      console.error('Error checking authentication status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen for custom auth events from login/logout
    const handleAuthEvent = () => {
      checkAuth();
    };

    window.addEventListener('auth-change', handleAuthEvent);

    return () => {
      window.removeEventListener('auth-change', handleAuthEvent);
    };
  }, []);

  return { isAuthenticated, isLoading };
};
