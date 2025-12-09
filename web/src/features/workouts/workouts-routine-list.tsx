import { SearchIcon } from '@/components/ui/icons';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import type { RoutineListProps } from '@/types/workout';

import { getAvailableDays, getTotalExerciseCount, filterRoutines } from '@/utils';

export const WorkoutRoutineList: React.FC<RoutineListProps> = ({
  routines,
  searchTerm,
  onSearchChange,
  onRoutineSelect,
  onCreateRoutine,
  creating,
}) => {
  const filteredRoutines = filterRoutines(routines, searchTerm);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose from Your Routines</CardTitle>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search routines..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredRoutines.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              {routines.length === 0
                ? "You don't have any routines yet."
                : 'No routines match your search.'}
            </p>
            {routines.length === 0 && (
              <Button variant="outline" onClick={onCreateRoutine}>
                Create Your First Routine
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredRoutines.map((routine) => {
              const availableDays = getAvailableDays(routine);
              const totalExercises = getTotalExerciseCount(routine);

              return (
                <div
                  key={routine.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{routine.title}</h3>
                    {routine.description && (
                      <p className="text-gray-600 text-sm mt-1">{routine.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>{totalExercises} exercises</span>
                      <span>
                        {availableDays.length} day
                        {availableDays.length !== 1 ? 's' : ''}
                      </span>
                      {routine.difficulty && (
                        <span className="capitalize">{routine.difficulty.toLowerCase()}</span>
                      )}
                    </div>
                    {availableDays.length > 1 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Days: {availableDays.map((d) => d.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => onRoutineSelect(routine)}
                    disabled={creating}
                    className="mt-3 sm:mt-0 sm:ml-4 w-full sm:w-auto"
                    variant="outline"
                  >
                    Select Routine
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
