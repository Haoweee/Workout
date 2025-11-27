import { useNavigate } from 'react-router-dom';

import { Dumbbell } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import type { WorkoutsExerciseListProps } from '@/types/workout';

import { displayWeight, getUniqueSets } from '@/utils';

export const WorkoutExerciseList: React.FC<WorkoutsExerciseListProps> = ({
  workout,
  preferences,
}) => {
  const navigate = useNavigate();
  return (
    <>
      {workout.exercises.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {workout.exercises.map((exercise, index) => (
                <div key={`${exercise.exerciseId || exercise.exerciseName}-${index}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{exercise.exerciseName}</h3>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">
                            Set
                          </th>
                          <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">
                            Weight ({preferences.weightUnit})
                          </th>
                          <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">
                            Reps
                          </th>
                          <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">
                            RPE
                          </th>
                          <th className="text-left py-2 px-4 text-sm font-medium text-gray-700">
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getUniqueSets(exercise.sets)
                          .sort((a, b) => a.setNumber - b.setNumber)
                          .map((set, setIndex) => (
                            <tr key={setIndex} className="border-b border-gray-100">
                              <td className="py-2 px-4 text-sm">{set.setNumber}</td>
                              <td className="py-2 px-4 text-sm">
                                {displayWeight(set.weightKg, preferences)}
                              </td>
                              <td className="py-2 px-4 text-sm">{set.reps || '-'}</td>
                              <td className="py-2 px-4 text-sm">{set.rpe || '-'}</td>
                              <td className="py-2 px-4 text-sm">{set.notes || '-'}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No exercises logged</h3>
            <p className="text-gray-600 mb-4">
              This workout doesn't have any exercises logged yet.
            </p>
            {!workout.finishedAt && (
              <Button
                onClick={() => navigate(`/workouts/${workout.id}/active`)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Exercises
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};
