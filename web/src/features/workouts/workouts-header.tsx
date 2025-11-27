import { useNavigate } from 'react-router-dom';

import { ArrowLeft, Trash2, Plus, Clock, Target } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useDeleteWorkout } from '@/hooks/workouts';

import type { WorkoutHeaderProps } from '@/types/workout';

import { formatTime } from '@/utils/formatters';

export const WorkoutHeader: React.FC<WorkoutHeaderProps> = ({
  navigation,
  type,
  workout,
  handleQuickStart,
  creating,
  progress,
  startTime,
  currentTime,
}) => {
  const navigate = useNavigate();

  const { isDeleting: deleting, deleteWorkout: handleDelete } = useDeleteWorkout();

  let headerContent: React.ReactNode;
  switch (type) {
    case 'active':
      headerContent = (
        <>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {workout?.title || 'Active Workout'}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mt-1">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(currentTime ?? new Date(), startTime ?? new Date())}
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {progress?.completed}/{progress?.total} sets
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress?.percentage}%` }}
              />
            </div>
          </div>
          <div className="w-10" />
        </>
      );
      break;
    case 'start':
      headerContent = (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Start a blank workout and add exercises as you go</p>
            <Button onClick={handleQuickStart} disabled={creating} className="w-full sm:w-auto">
              {creating ? 'Starting...' : 'Start Empty Workout'}
            </Button>
          </CardContent>
        </Card>
      );
      break;
    default:
      headerContent = (
        <div className="w-full flex flex-row justify-between items-center">
          <h2 className="text-2xl font-bold">{workout?.title}</h2>
          <div className="flex flex-row items-center gap-2">
            {workout && workout.finishedAt && (
              <Button
                onClick={() => navigate(`/workouts/${workout.id}/active`)}
                className="bg-green-600 hover:bg-green-700"
              >
                Continue Workout
              </Button>
            )}
            {workout && (
              <Button
                variant="outline"
                onClick={() => handleDelete(workout.id, navigate)}
                disabled={deleting}
                className="text-red-600 hover:text-red-700 hover:border-red-200"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      );
      break;
  }

  return (
    <div
      className={`flex items-center gap-4 mb-6 ${
        type === 'start'
          ? 'w-full flex-col items-start'
          : type === 'active'
            ? 'w-full justify-between'
            : ''
      }`}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          typeof navigation === 'number' ? navigate(navigation) : navigate(navigation)
        }
        className="p-2"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {headerContent}
    </div>
  );
};
