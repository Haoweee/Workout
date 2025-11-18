import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { HomePage } from '@/pages/marketing/HomePage';
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
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
        </Route>

        {/* Auth-only but WITHOUT layout (e.g., login/signup pages) */}
        <Route element={<PublicRoute layout={BlankLayout} />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/otp" element={<OtpPage />} />
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
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-6">Page not found</p>
                <a href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Go Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
