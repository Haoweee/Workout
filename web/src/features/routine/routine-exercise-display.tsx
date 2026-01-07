import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { Routine } from '@/types/routine';

export const RoutineExerciseDisplay: React.FC<{ routine: Routine }> = ({ routine }) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getDayOfWeek = (dayIndex: number) => {
    return daysOfWeek[dayIndex % 7];
  };

  return (
    <Card>
      <CardContent className="pt-6 pb-4">
        {routine.routineExercises && routine.routineExercises.length > 0 ? (
          (() => {
            // Group exercises by dayIndex
            const exercisesByDay: {
              [dayIndex: number]: typeof routine.routineExercises;
            } = {};
            routine.routineExercises.forEach((ex) => {
              if (!exercisesByDay[ex.dayIndex]) exercisesByDay[ex.dayIndex] = [];
              exercisesByDay[ex.dayIndex].push(ex);
            });
            return (
              <div className="space-y-8">
                {Object.entries(exercisesByDay).map(([dayIndex, exercises]) => (
                  <div key={dayIndex} className="mb-4 sm:mb-6">
                    <h2 className="font-bold text-lg sm:text-xl mb-2">
                      {getDayOfWeek(Number(dayIndex))}
                    </h2>
                    <div className="overflow-x-auto">
                      <Table className="w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-left font-bold  py-2 sm:py-3">
                              Exercise
                            </TableHead>
                            <TableHead className="text-right font-bold py-2 sm:py-3">
                              Sets
                            </TableHead>
                            <TableHead className="text-right font-bold py-2 sm:py-3">
                              Reps
                            </TableHead>
                            <TableHead className="text-right font-bold py-2 sm:py-3">
                              Rest
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {exercises.map((exercise) => (
                            <TableRow key={exercise.id}>
                              <TableCell className="text-left font-medium py-2 sm:py-3">
                                <div className="flex items-center gap-2">
                                  {exercise.customExerciseName ||
                                    exercise.exercise?.name ||
                                    'Unknown Exercise'}
                                </div>
                              </TableCell>
                              <TableCell className="text-right py-2 sm:py-3">
                                {exercise.sets}
                              </TableCell>
                              <TableCell className="text-right py-2 sm:py-3">
                                {exercise.reps}
                              </TableCell>
                              <TableCell className="text-right py-2 sm:py-3">
                                {exercise.restSeconds}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No exercises added to this routine yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
