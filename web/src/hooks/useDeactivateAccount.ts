import { useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/user.service';

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
