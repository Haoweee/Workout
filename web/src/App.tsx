import { Provider } from 'react-redux';
import { store } from '@/store';
import { AppRouter } from '@/router/AppRouter';

/**
 * Root App Component
 *
 * Providers are now loaded conditionally within the routers
 * to prevent unnecessary loading for guest users
 */
function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}

export default App;
