import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import Loading from '@/components/loading/spinner';

// Guest context instead of full auth
import { GuestProvider } from '@/context/GuestContext';

// Lightweight route components - no full auth context
import GuestOnlyRoute from '@/components/auth/GuestOnlyRoute';

// Lazy load only what guests need
const PublicLayout = lazy(() => import('@/components/layout/PublicLayout'));
const BlankLayout = lazy(() => import('@/components/layout/BlankLayout'));
const ScrollToTop = lazy(() => import('@/components/layout/ScrollToTop'));
const RegistrationProvider = lazy(() => import('@/context/RegistrationContext'));

// Guest pages
const HomePage = lazy(() => import('@/pages/marketing/HomePage'));
const AboutPage = lazy(() => import('@/pages/marketing/AboutPage'));
const ContactPage = lazy(() => import('@/pages/marketing/ContactPage'));
const LegalPage = lazy(() => import('@/pages/marketing/LegalPage'));
const HelpCenterPage = lazy(() => import('@/pages/marketing/HelpCenterPage'));
const GettingStartedPage = lazy(() => import('@/pages/marketing/GettingStartedPage'));
const TroubleshootingPage = lazy(() => import('@/pages/marketing/TroubleshootingPage'));
const ExercisesPage = lazy(() => import('@/pages/exercises/ExercisesPage'));
const ExerciseDetailPage = lazy(() => import('@/pages/exercises/ExerciseDetailPage'));
const RoutinesPage = lazy(() => import('@/pages/marketing/RoutinesPage'));

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const OtpPage = lazy(() => import('@/pages/auth/OtpPage'));
const FallBackPage = lazy(() => import('@/pages/marketing/FallBackPage'));

interface GuestRouterProps {
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const GuestRouter: React.FC<GuestRouterProps> = ({ isAuthenticated, isLoading }) => {
  return (
    <GuestProvider>
      <Suspense fallback={<Loading />}>
        <ScrollToTop />
        <Routes>
          {/* Auth flow routes */}
          <Route
            element={
              <Suspense fallback={<Loading />}>
                <RegistrationProvider>
                  <GuestOnlyRoute
                    layout={BlankLayout}
                    isAuthenticated={isAuthenticated}
                    isLoading={isLoading}
                  />
                </RegistrationProvider>
              </Suspense>
            }
          >
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-otp" element={<OtpPage />} />
          </Route>

          {/* Guest marketing pages */}
          <Route
            element={
              <GuestOnlyRoute
                layout={PublicLayout}
                isAuthenticated={isAuthenticated}
                isLoading={isLoading}
              />
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/getting-started" element={<GettingStartedPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/troubleshooting" element={<TroubleshootingPage />} />
            <Route path="/exercises" element={<ExercisesPage />} />
            <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
            <Route path="/routines" element={<RoutinesPage />} />
          </Route>

          {/* 404 fallback */}
          <Route path="*" element={<FallBackPage />} />
        </Routes>
      </Suspense>
    </GuestProvider>
  );
};

export default GuestRouter;
