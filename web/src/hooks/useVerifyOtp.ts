import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { RegisterRequest } from '@/types/api';

export const useVerifyOtp = () => {
  const { verifyOtp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyOtp = async (userData: RegisterRequest, otp: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await verifyOtp(userData, otp);
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleVerifyOtp,
    isLoading,
    error,
  };
};
