import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import Loading from '@/components/loading/spinner';

// Providers for authenticated users
import { AuthProvider } from '@/context/AuthContext';
import { UserPreferencesProvider } from '@/context/UserPreferencesContext';

// Auth-required imports
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PublicRoute from '@/components/auth/PublicRoute';
import MixedRoute from '@/components/auth/MixedRoute';

// Lazy load layouts
const AppLayout = lazy(() => import('@/components/layout/AppLayout'));
const PublicLayout = lazy(() => import('@/components/layout/PublicLayout'));
const BlankLayout = lazy(() => import('@/components/layout/BlankLayout'));
const ScrollToTop = lazy(() => import('@/components/layout/ScrollToTop'));
const RegistrationProvider = lazy(() => import('@/context/RegistrationContext'));

// Mixed pages (available to both auth and guest but rendered differently)
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
const AccountSettingsPage = lazy(() => import('@/pages/marketing/AccountSettingsPage'));

// Auth pages
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const SignupPage = lazy(() => import('@/pages/auth/SignupPage'));
const OtpPage = lazy(() => import('@/pages/auth/OtpPage'));

// Authenticated-only pages
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/profile/SettingsPage'));
const ChangePasswordPage = lazy(() => import('@/pages/profile/ChangePasswordPage'));
const SetPasswordPage = lazy(() => import('@/pages/profile/SetPasswordPage'));
const CreateRoutinePage = lazy(() => import('@/pages/routines/CreateRoutinePage'));
const EditRoutinePage = lazy(() => import('@/pages/routines/EditRoutinePage'));
const RoutineDetailPage = lazy(() => import('@/pages/routines/RoutineDetailPage'));
const WorkoutsPage = lazy(() => import('@/pages/workouts/WorkoutsPage'));
const StartWorkoutPage = lazy(() => import('@/pages/workouts/StartWorkoutPage'));
const WorkoutDetailPage = lazy(() => import('@/pages/workouts/WorkoutDetailPage'));
const ActiveWorkoutPage = lazy(() => import('@/pages/workouts/ActiveWorkoutPage'));

const FallBackPage = lazy(() => import('@/pages/marketing/FallBackPage'));

export const AuthenticatedRouter: React.FC = () => {
  return (
    <AuthProvider>
      <UserPreferencesProvider>
        <Suspense fallback={<Loading />}>
          <ScrollToTop />
          <Routes>
            {/* Auth flow routes */}
            <Route
              element={
                <Suspense fallback={<Loading />}>
                  <RegistrationProvider>
                    <PublicRoute layout={BlankLayout} />
                  </RegistrationProvider>
                </Suspense>
              }
            >
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/verify-otp" element={<OtpPage />} />
            </Route>

            {/* Mixed routes for authenticated users */}
            <Route element={<MixedRoute authedLayout={AppLayout} guestLayout={PublicLayout} />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/getting-started" element={<GettingStartedPage />} />
              <Route path="/help" element={<HelpCenterPage />} />
              <Route path="/legal" element={<LegalPage />} />
              <Route path="/troubleshooting" element={<TroubleshootingPage />} />
              <Route path="/account-settings" element={<AccountSettingsPage />} />
              <Route path="/exercises" element={<ExercisesPage />} />
              <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
              <Route path="/routines" element={<RoutinesPage />} />
            </Route>

            {/* Auth-specific routes */}
            <Route
              element={
                <Suspense fallback={<Loading />}>
                  <RegistrationProvider>
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  </RegistrationProvider>
                </Suspense>
              }
            >
              <Route path="/profile/verify-otp" element={<OtpPage />} />
              <Route path="/change-password" element={<ChangePasswordPage />} />
              <Route path="/set-password" element={<SetPasswordPage />} />
            </Route>

            {/* Protected app routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/settings" element={<SettingsPage />} />
              <Route path="/routines/create" element={<CreateRoutinePage />} />
              <Route path="/routines/:id/edit" element={<EditRoutinePage />} />
              <Route path="/routines/:id" element={<RoutineDetailPage />} />
              <Route path="/workouts" element={<WorkoutsPage />} />
              <Route path="/workouts/new" element={<StartWorkoutPage />} />
              <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
              <Route path="/workouts/:id/active" element={<ActiveWorkoutPage />} />
            </Route>

            {/* 404 fallback */}
            <Route path="*" element={<FallBackPage />} />
          </Routes>
        </Suspense>
      </UserPreferencesProvider>
    </AuthProvider>
  );
};

export default AuthenticatedRouter;
