import { useNavigate } from 'react-router-dom';

import { Merge } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { AuthContextType } from '@/context/auth-context';

interface CTAProps {
  user: AuthContextType['user'];
}

export const CTA = ({ user }: CTAProps) => {
  const navigate = useNavigate();
  return (
    <div className="text-center space-y-6 mb-18">
      <Merge className="mx-auto" />
      <h2 className="text-2xl font-bold">Ready to Elevate Your Workouts?</h2>
      <p className="text-lg">
        Join thousands of fitness enthusiasts using our app to track and optimize their workouts.
      </p>
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
  );
};
