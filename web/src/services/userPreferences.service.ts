import { STORAGE_KEYS } from '@/constants';
import { DEFAULT_USER_PREFERENCES } from '@/types/preferences';
import type { UserPreferences, WeightUnit } from '@/types/preferences';

export class UserPreferencesService {
  private static storageKey = STORAGE_KEYS.USER_PREFERENCES;

  // Get preferences from localStorage
  static getPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return DEFAULT_USER_PREFERENCES;

      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_USER_PREFERENCES,
        ...parsed,
      };
    } catch (error) {
      console.warn('Failed to load user preferences:', error);
      return DEFAULT_USER_PREFERENCES;
    }
  }

  // Save preferences to localStorage
  static setPreferences(preferences: UserPreferences): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }

  // Update specific preference
  static updatePreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, [key]: value };
    this.setPreferences(updated);
    return updated;
  }

  // Get current weight unit
  static getWeightUnit(): WeightUnit {
    return this.getPreferences().weightUnit;
  }

  // Set weight unit
  static setWeightUnit(weightUnit: WeightUnit): UserPreferences {
    return this.updatePreference('weightUnit', weightUnit);
  }

  // Clear all preferences
  static clearPreferences(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Failed to clear user preferences:', error);
    }
  }
}
