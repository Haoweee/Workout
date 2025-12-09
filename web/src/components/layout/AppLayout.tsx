import { Outlet } from 'react-router-dom';

import { AuthenticatedNavbar } from './AuthenticatedNavbar';
import { Footer } from './Footer';

function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AuthenticatedNavbar />
      <main className="flex-1 py-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
