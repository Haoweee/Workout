import type { AuthContextType } from '@/context/auth-context';

export interface User {
  id: string;
  email: string;
  fullName: string;
  username: string;
  avatarUrl?: string;
  bio?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  hasPassword: boolean;
  providers?: {
    provider: string;
    providerId: string;
  }[];
}

export interface UpdateProfileRequest {
  fullName?: string;
  username?: string;
  bio?: string;
}

export interface UpdateProfileResponse {
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  isUpdating: boolean;
  error: string | null;
}

export interface UserProps {
  user: AuthContextType['user'];
}

export interface ProfileEditorProps {
  user: User;
}

export interface AvatarUploadReturn {
  uploadAvatar: (file: File) => Promise<void>;
  isUploading: boolean;
  error: string | null;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
}
