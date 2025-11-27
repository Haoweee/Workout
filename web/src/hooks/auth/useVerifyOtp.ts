import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authService } from '@/services';

import type { VerifyOtpRequest } from '@/types/api';

import { logger } from '@/lib/logger';

/**
 * Custom hook for verifying OTP functionality
 *
 * Handles all verify OTP-related business logic:
 * - Form submission
 * - Navigation after verifying OTP
 * - Error handling
 * - Loading states
 */
export const useVerifyOtp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const handleVerifyOtp = async ({ email, otp, type }: VerifyOtpRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.verifyOtp({ email, otp, type });
      navigate('/profile?tab=workouts');
    } catch (err) {
      logger.error('OTP verification failed:', err);
      setError(err as Error);
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
