// Weight unit types
export type WeightUnit = 'kg' | 'lbs';

// User preferences interface
export interface UserPreferences {
  weightUnit: WeightUnit;
  theme?: 'light' | 'dark' | 'system';
}

// Default preferences
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  weightUnit: 'kg',
  theme: 'system',
};
