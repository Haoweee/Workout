import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';

import type { UserProps } from '@/types/user';

export const Header = ({ user }: UserProps) => {
  const navigate = useNavigate();
  return (
    <header className="lg:min-h-[calc(100vh-8rem)] w-full flex flex-col lg:flex-row items-center">
      {/* For Large Devices */}
      <div className="w-full md:w-2/5">
        <div className="hidden lg:flex flex-col gap-6">
          <h1 className="text-3xl font-bold">
            Build your perfect routine. Track every lift. Stay consistent.
          </h1>
          <div className="">
            Software that helps you plan, track, and optimize your workouts with AI insights.
          </div>
          <div>
            {!user ? (
              <Button size="lg" onClick={() => navigate('/signup')}>
                Get Started for Free
              </Button>
            ) : (
              <Button size="lg" onClick={() => navigate('/profile?tab=workouts')}>
                Go to Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full mb-8 lg:flex-1 lg:mb-0 lg:ml-4 border border-gray-400 rounded-xl">
        {/* image/video */}
      </div>

      {/* For Small Devices */}
      <div className="lg:hidden w-full">
        <div className="flex flex-col gap-6">
          <h1 className="lg:hidden text-3xl font-bold">
            Build your perfect routine. <br /> Track every lift. <br /> Stay consistent.
          </h1>
          <div className="lg:hidden">
            Software that helps you track and analyze your workouts effortlessly.
          </div>
          <div>
            {!user ? (
              <Button size="lg" onClick={() => navigate('/signup')}>
                Get Started for Free
              </Button>
            ) : (
              <Button size="lg" onClick={() => navigate('/profile?tab=workouts')}>
                Go to Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
