import React, { useEffect, useState, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@/types/user';
import type { LoginRequest, RegisterRequest, VerifyOtpRequest } from '@/types/api';
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
    try {
      await authService.login(credentials);
      // Always fetch complete profile after login to get all fields (bio, avatarUrl, hasPassword, etc.)
      const completeProfile = await userService.getProfile();
      setUser(completeProfile);
      // Notify useAuthCheck of auth state change
      window.dispatchEvent(new Event('auth-change'));
    } catch (error) {
      logger.error('Login failed:', error);
      throw error; // Re-throw so components can handle the error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send OTP function
  const sendOtp = useCallback(async (userData: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    try {
      const authResponse = await authService.sendOtp(userData);

      if (!authResponse) {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      logger.error('Registration failed:', error);
      throw error; // Re-throw so components can handle the error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(async (userData: VerifyOtpRequest, otp: string): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.verifyOtp({ ...userData, otp });
      // Always fetch complete profile after registration to get all fields (bio, avatarUrl, hasPassword, etc.)
      const completeProfile = await userService.getProfile();
      setUser(completeProfile);
    } catch (error) {
      logger.error('OTP verification failed:', error);
      throw error; // Re-throw so components can handle the error
    } finally {
      setIsLoading(false);
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
      // Notify useAuthCheck of auth state change
      window.dispatchEvent(new Event('auth-change'));
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
      sendOtp,
      verifyOtp,
      logout,
      refreshProfile,
      updateUser,
    }),
    [
      user,
      isLoading,
      isAuthenticated,
      login,
      sendOtp,
      verifyOtp,
      logout,
      refreshProfile,
      updateUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
