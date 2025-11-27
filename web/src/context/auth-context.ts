import { createContext } from 'react';
import type { User, LoginRequest, SendOtpRequest, VerifyOtpRequest } from '@/types/api';

export interface AuthContextType {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  sendOtp: (userData: SendOtpRequest) => Promise<void>;
  verifyOtp: (userData: VerifyOtpRequest, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateUser: (updatedUser: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
