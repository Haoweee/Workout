import { useState } from 'react';

import { useAuth } from '@/hooks/auth';

import { userService } from '@/services/user.service';

/**
 * Custom hook to deactivate the current user's account
 * @returns An object containing the deactivateAccount function, loading state, and any error encountered
 *
 * @example
 * const { deleteAccount, deleteLoading, deleteError } = useDeleteAccount();
 */
export const useDeleteAccount = () => {
  const { user, logout } = useAuth();
  const [deleteLoading, setLoading] = useState(false);
  const [deleteError, setError] = useState<string | null>(null);

  const deleteAccount = async () => {
    if (!user) return;
    setLoading(true);

    try {
      await userService.deleteAccount(user.id);

      await logout();
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Failed to delete account. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return { deleteAccount, deleteLoading, deleteError };
};
