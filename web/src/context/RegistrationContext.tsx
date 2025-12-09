import { useState, type ReactNode } from 'react';
import type { RegisterRequest } from '@/types/api';
import { RegistrationContext } from './RegistrationContextInstance';

const RegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<RegisterRequest | null>(null);
  return (
    <RegistrationContext.Provider value={{ userData, setUserData }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export default RegistrationProvider;
