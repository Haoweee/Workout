import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RegistrationProvider } from '@/context/RegistrationContext';
import { AppLayout } from '@/components/layout/AppLayout';
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
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { SettingsPage } from '@/pages/profile/SettingsPage';
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
import { BlankLayout, PublicLayout } from '@/components/layout';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public pages (no auth required). If you want a public layout, wrap it here. */}
        <Route
          element={
            <MixedRoute
              authedLayout={AppLayout}
              guestLayout={PublicLayout} // shows navbar/footer even for guests
            />
          }
        >
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

        {/* Auth-only but WITHOUT layout (e.g., login/signup pages) */}
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

        {/* Auth-only pages under AppLayout (navbar/footer + private content) */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/settings" element={<SettingsPage />} />

          {/* Routines (private) */}
          <Route path="/routines/create" element={<CreateRoutinePage />} />
          <Route path="/routines/:id/edit" element={<EditRoutinePage />} />
          <Route path="/routines/:id" element={<RoutineDetailPage />} />

          {/* Workouts (private) */}
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/workouts/new" element={<StartWorkoutPage />} />
          <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
          <Route path="/workouts/:id/active" element={<ActiveWorkoutPage />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<FallBackPage />} />
      </Routes>
    </BrowserRouter>
  );
};
