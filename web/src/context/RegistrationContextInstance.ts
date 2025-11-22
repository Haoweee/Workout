import { createContext } from 'react';
import type { RegisterRequest } from '@/types/api';

interface RegistrationContextType {
  userData: RegisterRequest | null;
  setUserData: (data: RegisterRequest | null) => void;
}

export const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);
