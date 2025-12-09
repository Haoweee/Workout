import React, { createContext, useContext } from 'react';

// Guest context - provides minimal auth state without services
const GuestContext = createContext<{
  isAuthenticated: false;
  user: null;
} | null>(null);

export const useGuestAuth = () => {
  const context = useContext(GuestContext);
  if (!context) {
    // Return guest defaults if not in provider
    return { isAuthenticated: false, user: null };
  }
  return context;
};

export const GuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = {
    isAuthenticated: false as const,
    user: null,
  };

  return <GuestContext.Provider value={value}>{children}</GuestContext.Provider>;
};
