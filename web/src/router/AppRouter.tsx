import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { checkAuth } from '@/store/authSlice';
import Loading from '@/components/loading/spinner';

// Lazy load the routers - only import what's needed based on auth state
const GuestRouter = lazy(() => import('./GuestRouter'));
const AuthenticatedRouter = lazy(() => import('./AuthenticatedRouter'));

// Router that adapts based on authentication state
const AppRouterContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Check auth on app startup
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      {isAuthenticated ? (
        <AuthenticatedRouter />
      ) : (
        <GuestRouter isAuthenticated={isAuthenticated} isLoading={isLoading} />
      )}
    </Suspense>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRouterContent />
    </BrowserRouter>
  );
};
