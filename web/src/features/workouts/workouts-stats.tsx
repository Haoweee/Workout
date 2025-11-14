import { Calendar, Clock, Dumbbell, Edit2 } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

import type { OptimizedWorkout } from '@/services/workout.service';
import type { WeightUnit } from '@/types/preferences';

import {
  formatDate,
  formatDuration,
  getUniqueSets,
  calculateWorkoutDuration,
  calculateTotalVolume,
} from '@/utils';

type WorkoutStatsProps = {
  workout: OptimizedWorkout;
  preferences: { weightUnit: WeightUnit };
};

export const WorkoutStats = ({ workout, preferences }: WorkoutStatsProps) => {
  const duration = calculateWorkoutDuration(workout);
  const totalVolume = calculateTotalVolume(preferences, workout);
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Started</p>
              <p className="font-semibold">{formatDate(workout.startedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-semibold">
                {workout.finishedAt ? formatDuration(duration) : 'In Progress'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Total Sets</p>
              <p className="font-semibold">
                {workout.exercises.reduce(
                  (total, exercise) => total + getUniqueSets(exercise.sets).length,
                  0
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Edit2 className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Volume</p>
              <p className="font-semibold">
                {totalVolume?.toFixed(1)} {preferences.weightUnit}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
