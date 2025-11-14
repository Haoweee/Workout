import { useState } from 'react';
import { userService } from '@/services/user.service';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types/api';

interface UseAvatarUploadReturn {
  uploadAvatar: (file: File) => Promise<void>;
  isUploading: boolean;
  error: string | null;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
}

/**
 * Custom hook for handling avatar upload functionality
 *
 * Features:
 * - File upload with progress tracking
 * - Image preview before upload
 * - Error handling
 * - Automatic auth context update after successful upload
 */
export const useAvatarUpload = (): UseAvatarUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { updateUser } = useAuth();

  const uploadAvatar = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        throw new Error('Image file size must be less than 5MB');
      }

      // Upload the avatar
      const updatedUser: User = await userService.uploadAvatar(file);

      // Update the user in auth context
      updateUser(updatedUser);

      // Clear preview
      setPreviewUrl(null);
    } catch (err) {
      console.error('Avatar upload failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadAvatar,
    isUploading,
    error,
    previewUrl,
    setPreviewUrl,
  };
};
