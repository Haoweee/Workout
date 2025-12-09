import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '@/hooks/auth/useAuth';

type LayoutComponent = React.ComponentType<{ children: React.ReactNode }>;

interface PublicRouteProps {
  redirectTo?: string;
  layout?: LayoutComponent; // e.g., BlankLayout or PublicLayout
}

/**
 * PublicRoute
 * - Only for unauthenticated users.
 * - If authed, redirects to `redirectTo` or location.state.from.
 * - Wraps nested routes in the provided `layout` using <Outlet/>.
 */
const PublicRoute: React.FC<PublicRouteProps> = ({
  redirectTo = '/',
  layout: Layout = React.Fragment,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isAuthenticated) {
    const back = (location.state as { from?: string } | null)?.from ?? redirectTo;
    return <Navigate to={back} replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default PublicRoute;
