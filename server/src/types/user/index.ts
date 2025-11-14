import { Decimal } from '@prisma/client/runtime/library';

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  fullName?: string;
  bio?: string;
  location?: string;
  website?: string;
  profilePicture?: string;
}

export interface UserProfileResponse {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  profilePicture: string | null;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PublicUserProfileResponse {
  id: string;
  username: string;
  fullName: string;
  bio: string | null;
  location: string | null;
  website: string | null;
  profilePicture: string | null;
  createdAt: Date;
  _count: {
    routines: number;
    workouts: number;
    votes: number;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Legacy types (still used in some controllers)
export interface UpdateProfileRequest {
  username?: string;
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  email?: string;
  bio?: string | null;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserProfileUpdate {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string | null;
  bio?: string | null;
  email: string;
  updatedAt: Date;
}

export interface UserAnalytics {
  user: {
    id: string;
    username: string;
    fullName: string;
    createdAt: Date;
  } | null;
  stats: {
    routinesCreated: number;
    workoutsCompleted: number;
    totalSets: number;
    memberSince: Date | undefined;
  };
  recentActivity: Array<{
    id: string;
    title: string | null;
    startedAt: Date;
    finishedAt: Date | null;
    workoutSets: Array<{
      exercise: {
        name: string;
      } | null;
      reps: number | null;
      weightKg: Decimal | null;
    }>;
  }>;
}
