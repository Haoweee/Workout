import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RegistrationProvider } from '@/context/RegistrationContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { BlankLayout, PublicLayout } from '@/components/layout';
import { ScrollToTop } from '@/components/ScrollToTop';
import {
  AboutPage,
  AccountSettingsPage,
  ContactPage,
  FallBackPage,
  GettingStartedPage,
  HomePage,
  HelpCenterPage,
  LegalPage,
  RoutinesPage,
  TroubleshootingPage,
} from '@/pages/marketing';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { OtpPage } from '@/pages/auth/OtpPage';
import { ChangePasswordPage, ProfilePage, SetPasswordPage, SettingsPage } from '@/pages/profile';
import { ExercisesPage } from '@/pages/exercises/ExercisesPage';
import { ExerciseDetailPage } from '@/pages/exercises/ExerciseDetailPage';
import { RoutineDetailPage } from '@/pages/routines/RoutineDetailPage';
import { CreateRoutinePage } from '@/pages/routines/CreateRoutinePage';
import { EditRoutinePage } from '@/pages/routines/EditRoutinePage';
import { WorkoutsPage } from '@/pages/workouts/WorkoutsPage';
import { StartWorkoutPage } from '@/pages/workouts/StartWorkoutPage';
import { WorkoutDetailPage } from '@/pages/workouts/WorkoutDetailPage';
import { ActiveWorkoutPage } from '@/pages/workouts/ActiveWorkoutPage';
import { ProtectedRoute, PublicRoute, MixedRoute } from '@/components/auth';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/** -----------------------------
         *  AUTH FLOW (needs RegistrationProvider)
         *  ----------------------------- */}
        <Route
          element={
            <RegistrationProvider>
              <PublicRoute layout={BlankLayout} />
            </RegistrationProvider>
          }
        >
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-otp" element={<OtpPage />} />
        </Route>

        <Route
          element={
            <RegistrationProvider>
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            </RegistrationProvider>
          }
        >
          <Route path="/profile/verify-otp" element={<OtpPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/set-password" element={<SetPasswordPage />} />
        </Route>

        {/** -----------------------------
         *  MIXED PUBLIC / AUTH PAGES
         *  ----------------------------- */}
        <Route element={<MixedRoute authedLayout={AppLayout} guestLayout={PublicLayout} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/account-settings" element={<AccountSettingsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
          <Route path="/getting-started" element={<GettingStartedPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/routines" element={<RoutinesPage />} />
          <Route path="/troubleshooting" element={<TroubleshootingPage />} />
        </Route>

        {/** -----------------------------
         *  PRIVATE WORKOUT/Routine PAGES
         *  ----------------------------- */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Profile */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/settings" element={<SettingsPage />} />

          {/* Routines */}
          <Route path="/routines/create" element={<CreateRoutinePage />} />
          <Route path="/routines/:id/edit" element={<EditRoutinePage />} />
          <Route path="/routines/:id" element={<RoutineDetailPage />} />

          {/* Workouts */}
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/workouts/new" element={<StartWorkoutPage />} />
          <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
          <Route path="/workouts/:id/active" element={<ActiveWorkoutPage />} />
        </Route>

        {/** 404 */}
        <Route path="*" element={<FallBackPage />} />
      </Routes>
    </BrowserRouter>
  );
};
