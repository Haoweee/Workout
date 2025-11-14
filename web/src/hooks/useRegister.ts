import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from './useApi';
import type { RegisterRequest } from '@/types/api';

export const useRegister = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const { isLoading, error, execute } = useApi({
    onSuccess: () => {
      // Small delay to ensure auth context is updated before navigation
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    },
    onError: (err) => {
      console.error('Registration failed:', err.message);
    },
  });

  const handleRegister = async (userData: RegisterRequest) => {
    await execute(() => register(userData));
  };

  return {
    handleRegister,
    isLoading,
    error,
  };
};
