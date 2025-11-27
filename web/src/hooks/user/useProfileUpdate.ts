import { useState } from 'react';

import { useAuth } from '@/hooks/auth';

import { userService } from '@/services/user.service';

import type { UpdateProfileRequest, UpdateProfileResponse, User } from '@/types/user';

/**
 * Custom hook for handling profile update functionality
 *
 * Features:
 * - Profile data validation
 * - API integration with loading states
 * - Error handling
 * - Automatic auth context update after successful update
 *
 * @example
 * const { updateProfile, isUpdating, error } = useProfileUpdate();
 */
export const useProfileUpdate = (): UpdateProfileResponse => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateUser } = useAuth();

  const updateProfile = async (data: UpdateProfileRequest) => {
    try {
      setIsUpdating(true);
      setError(null);

      // Validate required fields
      if (!data.fullName?.trim()) {
        throw new Error('Full name is required');
      }

      if (!data.username?.trim()) {
        throw new Error('Username is required');
      }

      // Validate username format (alphanumeric and underscores, 3-20 characters)
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(data.username)) {
        throw new Error(
          'Username must be 3-20 characters and contain only letters, numbers, and underscores'
        );
      }

      // Update the profile
      const updatedUser: User = await userService.updateProfile(data);

      // Update the user in auth context
      updateUser(updatedUser);
    } catch (err) {
      console.error('Profile update failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err; // Re-throw so component can handle it
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateProfile,
    isUpdating,
    error,
  };
};
