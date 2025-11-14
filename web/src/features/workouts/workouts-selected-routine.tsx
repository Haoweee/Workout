import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkoutDaySelector } from './workouts-day-selector';
import { getAvailableDays, getTotalExerciseCount } from '@/utils';
import type { Routine } from '@/types/api';

interface SelectedRoutineProps {
  routine: Routine;
  selectedDayIndex: number | null;
  onDaySelect: (dayIndex: number) => void;
  onStartWorkout: () => void;
  creating: boolean;
}

export const WorkoutSelectedRoutine = ({
  routine,
  selectedDayIndex,
  onDaySelect,
  onStartWorkout,
  creating,
}: SelectedRoutineProps) => {
  const availableDays = getAvailableDays(routine);
  const totalExercises = getTotalExerciseCount(routine);

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Calendar className="h-5 w-5" />
          Selected Routine
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <div className="mb-4">
            <h3 className="font-semibold text-blue-900">{routine.title}</h3>
            {routine.description && (
              <p className="text-blue-700 text-sm mt-1">{routine.description}</p>
            )}
            <p className="text-blue-600 text-sm mt-2">{totalExercises} exercises</p>
          </div>

          {(() => {
            if (availableDays.length === 0) {
              return (
                <p className="text-amber-700 text-sm">
                  This routine has no exercises. Please add exercises to start a workout.
                </p>
              );
            }

            if (availableDays.length === 1) {
              return (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-blue-700 text-sm">
                      {availableDays[0].name} - {availableDays[0].exerciseCount} exercises
                    </p>
                  </div>
                  <Button onClick={onStartWorkout} disabled={creating} className="w-full sm:w-auto">
                    {creating ? 'Starting...' : 'Start This Routine'}
                  </Button>
                </div>
              );
            }

            return (
              <div>
                <WorkoutDaySelector
                  routine={routine}
                  availableDays={availableDays}
                  selectedDayIndex={selectedDayIndex}
                  onDaySelect={onDaySelect}
                />

                <Button
                  onClick={onStartWorkout}
                  disabled={creating || selectedDayIndex === null}
                  className="w-full sm:w-auto"
                >
                  {creating ? 'Starting...' : 'Start Selected Day'}
                </Button>
              </div>
            );
          })()}
        </div>
      </CardContent>
    </Card>
  );
};
