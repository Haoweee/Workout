import { Play, Pause } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import type { RestTimerProps } from '@/types/workout';

import { formatRestTime } from '@/utils';

export const WorkoutRestTimer: React.FC<RestTimerProps> = ({
  isVisible,
  timeRemaining,
  isRunning,
  onToggle,
  onSkip,
}) => {
  if (!isVisible) return null;

  return (
    <Card className="mb-6 border-blue-500 bg-blue-50">
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {formatRestTime(timeRemaining)}
          </div>
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={onToggle}>
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={onSkip}>
              Skip Rest
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
