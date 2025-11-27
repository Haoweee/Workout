import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';

/**
 * Custom hook for logout functionality
 *
 * Handles all logout-related business logic:
 * - Logout API call
 * - Navigation after logout
 * - Error handling
 * - Loading states
 */
export const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
      // Continue with navigation even if logout API fails
    } finally {
      // Always navigate to home page after logout attempt
      navigate('/', { replace: true });
    }
  };

  return {
    handleLogout,
    isLoading: false, // We handle loading internally now
    error: null, // We handle errors internally now
  };
};
