// App constants
export const APP_NAME = 'Chi';
export const APP_DESCRIPTION = 'Your fitness routine sharing platform';

// API endpoints
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Server base URL (without /api)
export const SERVER_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

// Utility function to get full avatar URL
export const getAvatarUrl = (avatarUrl: string | null | undefined): string | undefined => {
  if (!avatarUrl) return undefined;

  // If it's already a full URL, return as is
  if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
    return avatarUrl;
  }

  // If it's a relative path, prepend server base URL
  return `${API_BASE_URL}${avatarUrl}`;
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/signup',
  ROUTINES: '/routines',
  EXERCISES: '/exercises',
  PROFILE: '/profile',
} as const;

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Exercise categories
export const EXERCISE_TYPES = {
  STRENGTH: 'STRENGTH',
  CARDIO: 'CARDIO',
  MOBILITY: 'MOBILITY',
} as const;

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'BEGINNER',
  INTERMEDIATE: 'INTERMEDIATE',
  ADVANCED: 'ADVANCED',
} as const;
