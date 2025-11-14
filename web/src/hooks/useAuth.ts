import { useContext } from 'react';
import { AuthContext } from '@/context/auth-context';
import type { AuthContextType } from '@/context/auth-context';

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
