import { useNavigate } from 'react-router-dom';

import { MergeIcon } from '@/components/ui/icons';

import { Button } from '@/components/ui/button';

import type { UserProps } from '@/types/user';

export const CTA = ({ user }: UserProps) => {
  const navigate = useNavigate();
  return (
    <div className="text-center space-y-6 mb-18">
      <MergeIcon className="mx-auto" />
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
