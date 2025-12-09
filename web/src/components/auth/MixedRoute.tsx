import React, { createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';

import { useAuth } from '@/hooks/auth/useAuth';

// Create context to share auth state with child components
const MixedRouteContext = createContext<{
  isAuthenticated: boolean;
  user: any;
} | null>(null);

export const useMixedRouteAuth = () => {
  const context = useContext(MixedRouteContext);
  if (!context) {
    // Fallback to useAuth if not in MixedRoute context
    return useAuth();
  }
  return context;
};

type LayoutComponent = React.ComponentType<{ children: React.ReactNode }>;

interface MixedRouteProps {
  authedLayout?: LayoutComponent; // e.g., AppLayout (navbar for signed-in users)
  guestLayout?: LayoutComponent; // e.g., PublicLayout (marketing navbar)
  // If you want the same layout for both, pass the same component to both props
}

/**
 * MixedRoute
 * - Accessible to both authed and unauth users.
 * - Renders different layouts based on auth status.
 * - Uses <Outlet/> so you can nest pages under this route in your Router.
 */
const MixedRoute: React.FC<MixedRouteProps> = ({
  authedLayout: AuthedLayout,
  guestLayout: GuestLayout,
}) => {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Choose layout (fallback to fragment if not provided)
  const Layout = isAuthenticated
    ? (AuthedLayout ?? React.Fragment)
    : (GuestLayout ?? React.Fragment);

  return (
    <MixedRouteContext.Provider value={{ isAuthenticated, user }}>
      <Layout>
        <Outlet />
      </Layout>
    </MixedRouteContext.Provider>
  );
};

export default MixedRoute;
