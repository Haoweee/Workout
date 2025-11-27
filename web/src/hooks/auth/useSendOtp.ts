import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { authService } from '@/services';

import type { SendOtpRequest } from '@/types/api';

import { logger } from '@/lib/logger';

/**
 * Custom hook for sending OTP functionality
 *
 * Handles all send OTP-related business logic:
 * - Form submission
 * - Navigation after sending OTP
 * - Error handling
 * - Loading states
 */
export const useSendOtp = ({ redirect }: { redirect: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const handleSendOtp = async (userData: SendOtpRequest) => {
    setError(null);
    setIsLoading(true);
    try {
      await authService.sendOtp(userData);
      // Small delay to ensure auth context is updated before navigation
      setTimeout(() => {
        navigate(redirect);
      }, 100);
    } catch (err) {
      logger.error('Send OTP failed:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSendOtp,
    isLoading,
    error,
  };
};
