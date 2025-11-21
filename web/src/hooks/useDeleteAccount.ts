import { useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/user.service';

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
