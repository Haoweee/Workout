import { createContext } from 'react';
import type { User, LoginRequest, RegisterRequest } from '@/types/api';

export interface AuthContextType {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  sendOtp: (userData: RegisterRequest) => Promise<void>;
  verifyOtp: (userData: RegisterRequest, otp: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
