import { useState } from 'react';

import { useAuth } from '@/hooks/auth';

import { userService } from '@/services/user.service';

/**
 * Custom hook to deactivate the current user's account
 * @returns An object containing the deactivateAccount function, loading state, and any error encountered
 *
 * @example
 * const { deactivateAccount, deactivateLoading, deactivateError } = useDeactivateAccount();
 */
export const useDeactivateAccount = () => {
  const { user, logout } = useAuth();
  const [deactivateLoading, setLoading] = useState(false);
  const [deactivateError, setError] = useState<string | null>(null);

  const deactivateAccount = async () => {
    if (!user) return;
    setLoading(true);

    try {
      await userService.deactivateAccount(user.id);

      await logout();
    } catch (error) {
      console.error('Error deactivating account:', error);
      setError('Failed to deactivate account. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return { deactivateAccount, deactivateLoading, deactivateError };
};
