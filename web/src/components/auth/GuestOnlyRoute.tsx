import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import Loading from '@/components/loading/spinner';

type LayoutComponent = React.ComponentType<{ children: React.ReactNode }>;

interface GuestOnlyRouteProps {
  redirectTo?: string;
  layout?: LayoutComponent;
  isAuthenticated?: boolean;
  isLoading?: boolean;
}

/**
 * GuestOnlyRoute - for guest users only
 * Accepts auth state as props to prevent duplicate API calls
 * Redirects authenticated users without loading services
 */
const GuestOnlyRoute: React.FC<GuestOnlyRouteProps> = ({
  redirectTo = '/workouts',
  layout: Layout = React.Fragment,
  isAuthenticated = false,
  isLoading = false,
}) => {
  const location = useLocation();

  if (isLoading) return <Loading />;

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

export default GuestOnlyRoute;
