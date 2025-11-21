import React, { useEffect, useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest } from '@/types/api';
import { authService, userService } from '@/services';
import { AuthContext } from './auth-context';
import type { AuthContextType } from './auth-context';
import { logger } from '@/lib/logger';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Use user presence for authentication state
  const isAuthenticated = !!user;

  // Initialize auth state on app load
  useEffect(() => {
    if (isInitialized) return;

    const initializeAuth = async () => {
      try {
        // Only call /auth/me once on load
        const me = await authService.isAuthenticated();
        if (me) {
          // Only fetch profile if authenticated
          const profile = await userService.getProfile();
          setUser(profile);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, [isInitialized]);

  // Login function
  const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
    setIsLoading(true);
    setJustLoggedIn(true);
    try {
      const authResponse = await authService.login(credentials);
      // Set the basic user data from login response first
      setUser(authResponse.user);

      // Always fetch complete profile after login to get all fields (bio, avatarUrl, etc.)
      try {
        const completeProfile = await userService.getProfile();
        setUser(completeProfile);
      } catch (profileError) {
        logger.warn('Failed to fetch complete profile after login:', profileError);
        // Still proceed with the basic user data from login
      }
    } catch (error) {
      logger.error('Login failed:', error);
      throw error; // Re-throw so components can handle the error
    } finally {
      setIsLoading(false);
      // Reset the flag after a delay to allow initialization to run normally next time
      setTimeout(() => setJustLoggedIn(false), 1000);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    setJustLoggedIn(true);
    try {
      const authResponse = await authService.register(userData);
      // Set the basic user data from register response first
      setUser(authResponse.user);

      // Always fetch complete profile after registration to get all fields (bio, avatarUrl, etc.)
      try {
        const completeProfile = await userService.getProfile();
        setUser(completeProfile);
      } catch (profileError) {
        logger.warn('Failed to fetch complete profile after registration:', profileError);
        // Still proceed with the basic user data from registration
      }
    } catch (error) {
      logger.error('Registration failed:', error);
      throw error; // Re-throw so components can handle the error
    } finally {
      setIsLoading(false);
      // Reset the flag after a delay to allow initialization to run normally next time
      setTimeout(() => setJustLoggedIn(false), 1000);
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      logger.error('Logout error:', error);
      // Continue with logout even if server request fails
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  // Refresh user profile
  const refreshProfile = useCallback(async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      const profile = await userService.getProfile();
      setUser(profile);
    } catch (error) {
      logger.error('Failed to refresh profile:', error);
      // If refresh fails, user might be logged out
      if (error && typeof error === 'object' && 'status' in error && error.status === 401) {
        await logout();
      }
      throw error;
    }
  }, [isAuthenticated, logout]);

  // Update user data in context (for optimistic updates)
  const updateUser = useCallback((updatedUser: User): void => {
    setUser(updatedUser);
  }, []);

  const value: AuthContextType = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      login,
      register,
      logout,
      refreshProfile,
      updateUser,
    }),
    [user, isLoading, isAuthenticated, login, register, logout, refreshProfile, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
