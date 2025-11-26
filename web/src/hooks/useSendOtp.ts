import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from './useApi';
import type { RegisterRequest } from '@/types/api';

export const useSendOtp = ({ redirect }: { redirect: string }) => {
  const { sendOtp } = useAuth();
  const navigate = useNavigate();

  const { isLoading, error, execute } = useApi({
    onSuccess: () => {
      // Small delay to ensure auth context is updated before navigation
      setTimeout(() => {
        navigate(redirect);
      }, 100);
    },
    onError: (err) => {
      console.error('Send OTP failed:', err.message);
    },
  });

  const handleSendOtp = async (userData: RegisterRequest) => {
    await execute(() => sendOtp(userData));
  };

  return {
    handleSendOtp,
    isLoading,
    error,
  };
};
