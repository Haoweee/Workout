import { AuthProvider } from '@/context/AuthContext';
import { UserPreferencesProvider } from '@/context/UserPreferencesContext';
import { AppRouter } from '@/router/AppRouter';

/**
 * Root App Component
 *
 * Wrapped with AuthProvider for authentication state management
 * and UserPreferencesProvider for user preferences (weight units, theme, etc.)
 */
function App() {
  return (
    <AuthProvider>
      <UserPreferencesProvider>
        <AppRouter />
      </UserPreferencesProvider>
    </AuthProvider>
  );
}

export default App;
