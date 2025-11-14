import { Outlet } from 'react-router-dom';

/**
 * BlankLayout
 * Minimal wrapper for pages like Login/Signup/OTP with no navbar or footer
 */
export function BlankLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Outlet />
    </div>
  );
}
