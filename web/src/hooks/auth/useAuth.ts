import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { logout, checkAuth } from '@/store/authSlice';

/**
 * Hook to access auth state and actions from Redux store
 * Use this instead of AuthContext for components that need auth state
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const refreshAuth = () => {
    dispatch(checkAuth());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    logout: handleLogout,
    refreshAuth,
  };
};
