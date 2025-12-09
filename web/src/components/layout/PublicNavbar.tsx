import React, { useState } from 'react';
import { MenuIcon } from '@/components/ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu-styles';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PublicNavbarProps {
  className?: string;
}

/**
 * PublicNavbar - Lightweight navbar for non-authenticated users
 * No auth hooks, no heavy components - optimized for fast initial load
 */
export const PublicNavbar: React.FC<PublicNavbarProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [{ path: '/exercises', label: 'Exercises' }];

  const isActive = (path: string) => location.pathname === path;

  const handleMobileNavigation = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 bg-white shadow-sm border-b ${className}`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 min-w-0 md:grid md:grid-cols-3">
          {/* Left Side - Logo/Brand */}
          <div className="flex items-center justify-start shrink-0 min-w-0">
            <button
              onClick={() => navigate('/')}
              className="text-xl font-bold text-gray-900 whitespace-nowrap"
            >
              Workout Tracker
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {menuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-opacity-50 z-30 md:hidden"
                onClick={() => setMenuOpen(false)}
              />

              {/* Menu Content */}
              <div className="fixed inset-0 top-16 bg-white z-40 md:hidden overflow-y-auto">
                <div className="px-4 py-4 space-y-2">
                  {/* Navigation Items */}
                  <div className="space-y-2">
                    {navItems.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleMobileNavigation(item.path)}
                        className={`block w-full text-left p-3 rounded-lg text-lg font-medium ${
                          isActive(item.path)
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Login/Signup for Mobile */}
                  <div className="border-t pt-6 space-y-2">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={() => handleMobileNavigation('/login')}
                    >
                      Login
                    </Button>
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() => handleMobileNavigation('/signup')}
                    >
                      Sign Up
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Center - Navigation Menu */}
          <div className="hidden md:flex justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        isActive(item.path) ? 'bg-accent text-accent-foreground' : '',
                        'cursor-pointer'
                      )}
                      onClick={() => navigate(item.path)}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side - Auth Buttons */}
          <div className="flex items-center justify-end space-x-2 shrink-0 min-w-0">
            {/* Mobile Menu Button */}
            <div className="flex md:hidden shrink-0">
              <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
                <MenuIcon className="h-5 w-5" />
              </Button>
            </div>

            {/* Desktop Authentication Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="whitespace-nowrap"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                variant="default"
                size="sm"
                className="whitespace-nowrap"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
