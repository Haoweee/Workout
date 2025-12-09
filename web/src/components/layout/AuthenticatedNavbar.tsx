import React, { useState } from 'react';
import {
  LogOutIcon,
  UserRoundIcon,
  DumbbellIcon,
  PlusIcon,
  ListIcon,
  MenuIcon,
  SettingsIcon,
  ChevronDownIcon,
} from '@/components/ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import { useLogout } from '@/hooks/auth/useLogout';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@/components/ui/navigation-menu';
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu-styles';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AvatarProfile } from '@/components/profile/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AuthenticatedNavbarProps {
  className?: string;
}

/**
 * AuthenticatedNavbar - Full-featured navbar for logged-in users
 * Includes workouts, routines, profile, and logout functionality
 */
export const AuthenticatedNavbar: React.FC<AuthenticatedNavbarProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useAuth();
  console.log('User in AuthenticatedNavbar:', user);
  const { handleLogout } = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileWorkoutsOpen, setMobileWorkoutsOpen] = useState(false);
  const [mobileRoutinesOpen, setMobileRoutinesOpen] = useState(false);

  const navItems = [{ path: '/exercises', label: 'Exercises' }];

  const isActive = (path: string) => location.pathname === path;

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
    if (menuOpen) {
      setMobileWorkoutsOpen(false);
      setMobileRoutinesOpen(false);
    }
  };

  const handleMobileNavigation = (path: string) => {
    navigate(path);
    setMenuOpen(false);
    setMobileWorkoutsOpen(false);
    setMobileRoutinesOpen(false);
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
                  {/* Workouts Section */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setMobileWorkoutsOpen(!mobileWorkoutsOpen)}
                      className="flex items-center justify-between w-full p-3 text-left text-lg font-medium text-gray-900"
                    >
                      <span className="flex items-center gap-2">
                        <DumbbellIcon className="h-5 w-5" />
                        Workouts
                      </span>
                      <ChevronDownIcon
                        className={`h-5 w-5 transition-transform ${
                          mobileWorkoutsOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {mobileWorkoutsOpen && (
                      <div className="pl-4 space-y-2">
                        <button
                          onClick={() => handleMobileNavigation('/profile?tab=workouts')}
                          className="block w-full text-left p-3 rounded-lg text-sm hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <DumbbellIcon className="h-4 w-4" />
                            <span>My Workouts</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            View and track all your workout sessions
                          </p>
                        </button>
                        <button
                          onClick={() => handleMobileNavigation('/workouts/new')}
                          className="block w-full text-left p-3 rounded-lg text-sm hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <PlusIcon className="h-4 w-4" />
                            <span>Start Workout</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Begin a new workout session</p>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Routines Section */}
                  <div>
                    <button
                      onClick={() => setMobileRoutinesOpen(!mobileRoutinesOpen)}
                      className="flex items-center justify-between w-full p-3 text-left text-lg font-medium text-gray-900"
                    >
                      <span className="flex items-center gap-2">
                        <ListIcon className="h-5 w-5" />
                        Routines
                      </span>
                      <ChevronDownIcon
                        className={`h-5 w-5 transition-transform ${
                          mobileRoutinesOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {mobileRoutinesOpen && (
                      <div className="pl-4 space-y-2">
                        <button
                          onClick={() => handleMobileNavigation('/profile?tab=routines')}
                          className="block w-full text-left p-3 rounded-lg text-sm hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <ListIcon className="h-4 w-4" />
                            <span>My Routines</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            View routines in your profile
                          </p>
                        </button>
                        <button
                          onClick={() => handleMobileNavigation('/routines/create')}
                          className="block w-full text-left p-3 rounded-lg text-sm hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-2">
                            <PlusIcon className="h-4 w-4" />
                            <span>Create Routine</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Build a new workout routine</p>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Other Navigation Items */}
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

                  {/* Profile Section for Mobile */}
                  {user && (
                    <div className="border-t pt-6 space-y-2">
                      <div className="flex items-center gap-3 p-3">
                        <AvatarProfile
                          avatarUrl={user.avatarUrl}
                          fullName={user.fullName}
                          email={user.email}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.fullName || 'Full Name'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleMobileNavigation('/profile?tab=workouts')}
                        className="flex items-center gap-2 w-full text-left p-3 rounded-lg text-sm hover:bg-gray-50"
                      >
                        <UserRoundIcon className="h-4 w-4" />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={() => handleMobileNavigation('/profile/settings')}
                        className="flex items-center gap-2 w-full text-left p-3 rounded-lg text-sm hover:bg-gray-50"
                      >
                        <SettingsIcon className="h-4 w-4" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMenuOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left p-3 rounded-lg text-sm hover:bg-gray-50 text-red-600"
                      >
                        <LogOutIcon className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Center - Navigation Menu */}
          <div className="hidden md:flex justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Workouts Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Workouts</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[350px]">
                      <NavigationMenuLink
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none cursor-pointer hover:bg-accent"
                        onClick={() => navigate('/profile?tab=workouts')}
                      >
                        <div className="flex items-center gap-2">
                          <DumbbellIcon className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">My Workouts</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          View and track all your workout sessions
                        </p>
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none cursor-pointer hover:bg-accent"
                        onClick={() => navigate('/workouts/new')}
                      >
                        <div className="flex items-center gap-2">
                          <PlusIcon className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">Start Workout</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Begin a new workout session
                        </p>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Routines Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Routines</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-4 w-[400px]">
                      <NavigationMenuLink
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none cursor-pointer hover:bg-accent"
                        onClick={() => navigate('/profile?tab=routines')}
                      >
                        <div className="flex items-center gap-2">
                          <ListIcon className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">My Routines</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          View routines in your profile
                        </p>
                      </NavigationMenuLink>
                      <NavigationMenuLink
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none cursor-pointer hover:bg-accent"
                        onClick={() => navigate('/routines/create')}
                      >
                        <div className="flex items-center gap-2">
                          <PlusIcon className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">Create Routine</div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Build a new workout routine
                        </p>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Other Navigation Items */}
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

          {/* Right Side - Profile and Logout */}
          <div className="flex items-center justify-end space-x-2 shrink-0 min-w-0">
            {/* Mobile Menu Button */}
            <div className="flex md:hidden shrink-0">
              <Button variant="ghost" size="icon" onClick={handleMenuToggle}>
                <MenuIcon className="h-5 w-5" />
              </Button>
            </div>

            {/* Desktop Profile Menu */}
            <div className="hidden md:flex items-center space-x-2">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-10 w-10 rounded-full animate-pulse bg-gray-200" />
                  <div className="hidden sm:block space-y-2">
                    <Skeleton className="h-4 w-[120px] animate-pulse bg-gray-200" />
                    <Skeleton className="h-4 w-[100px] animate-pulse bg-gray-200" />
                  </div>
                </div>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="rounded-full p-1 hover:bg-gray-100 transition-colors">
                    <AvatarProfile
                      avatarUrl={user.avatarUrl}
                      fullName={user.fullName}
                      email={user.email}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>{user.fullName || 'Full Name'}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile?tab=workouts')}>
                      <UserRoundIcon className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile/settings')}>
                      <SettingsIcon className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-600"
                    >
                      <LogOutIcon className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
