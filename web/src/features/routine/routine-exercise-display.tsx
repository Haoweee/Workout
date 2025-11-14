import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import type { Routine } from '@/types/api';

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
                  <div key={dayIndex} className="mb-6">
                    <h2 className="font-bold text-xl mb-2">{getDayOfWeek(Number(dayIndex))}</h2>
                    <Table className="w-full table-fixed">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/2 text-left font-bold">Exercise</TableHead>
                          <TableHead className="w-1/4 text-right font-bold">Sets</TableHead>
                          <TableHead className="w-1/12 text-right font-bold">Reps</TableHead>
                          <TableHead className="w-1/12 text-right font-bold">Rest</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {exercises.map((exercise) => (
                          <TableRow key={exercise.id}>
                            <TableCell className="w-1/2 text-left font-medium">
                              <div className="flex items-center gap-2">
                                {exercise.customExerciseName ||
                                  exercise.exercise?.name ||
                                  'Unknown Exercise'}
                              </div>
                            </TableCell>
                            <TableCell className="w-1/4 text-right">{exercise.reps}</TableCell>
                            <TableCell className="w-1/12 text-right">{exercise.sets}</TableCell>
                            <TableCell className="w-1/12 text-right">
                              {exercise.restSeconds}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
