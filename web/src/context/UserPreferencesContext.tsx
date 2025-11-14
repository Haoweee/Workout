import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { UserPreferencesService } from '@/services/userPreferences.service';
import type { UserPreferences, WeightUnit } from '@/types/preferences';

interface UserPreferencesContextValue {
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setWeightUnit: (unit: WeightUnit) => void;
  isLoading: boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextValue | undefined>(undefined);

interface UserPreferencesProviderProps {
  children: ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(
    UserPreferencesService.getPreferences()
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load preferences on mount
    try {
      const storedPreferences = UserPreferencesService.getPreferences();
      setPreferences(storedPreferences);
    } catch (error) {
      console.error('Failed to load user preferences:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    UserPreferencesService.setPreferences(newPreferences);
  };

  const setWeightUnit = (weightUnit: WeightUnit) => {
    updatePreferences({ weightUnit });
  };

  const value: UserPreferencesContextValue = {
    preferences,
    updatePreferences,
    setWeightUnit,
    isLoading,
  };

  return (
    <UserPreferencesContext.Provider value={value}>{children}</UserPreferencesContext.Provider>
  );
};

export { UserPreferencesContext };
export type { UserPreferencesContextValue };
