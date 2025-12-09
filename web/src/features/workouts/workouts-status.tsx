import { useNavigate } from 'react-router-dom';

import { ClockIcon } from '@/components/ui/icons';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import type { OptimizedWorkout } from '@/types/workout';

export const WorkoutStatus: React.FC<{ workout: OptimizedWorkout }> = ({ workout }) => {
  const navigate = useNavigate();

  return (
    <Card className="mb-6 border-amber-200 bg-amber-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5 text-amber-600" />
            <div>
              <p className="font-semibold text-amber-900">Workout in Progress</p>
              <p className="text-amber-700 text-sm">
                This workout is still active. Continue to add more sets.
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate(`/workouts/${workout.id}/active`)}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
