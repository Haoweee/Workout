import { useContext } from 'react';

import { UserPreferencesContext } from '@/context/UserPreferencesContext';
import type { UserPreferencesContextValue } from '@/context/UserPreferencesContext';

export const useUserPreferences = (): UserPreferencesContextValue => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
