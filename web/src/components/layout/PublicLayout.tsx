import { Outlet } from 'react-router-dom';

import { PublicNavbar } from './PublicNavbar';
import { Footer } from './Footer';

/**
 * PublicLayout
 * Used for public pages that should still have the navbar and footer
 * (e.g. home page, exercises, about, etc.)
 */
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavbar />
      <main className="flex-1 py-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
