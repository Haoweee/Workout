import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatWeightDisplay } from '@/utils';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import type { OptimizedWorkout } from '@/services/workout.service';

interface WorkoutOverviewProps {
  workout: OptimizedWorkout;
  activeExerciseIndex: number;
  activeSetIndex: number;
  onExerciseClick: (exerciseIndex: number) => void;
}

export const WorkoutOverview = ({
  workout,
  activeExerciseIndex,
  activeSetIndex,
  onExerciseClick,
}: WorkoutOverviewProps) => {
  const { preferences } = useUserPreferences();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workout Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workout.exercises.map((exercise, exerciseIndex) => (
            <div
              key={`${exercise.exerciseId || exercise.exerciseName}-${exerciseIndex}`}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                exerciseIndex === activeExerciseIndex
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onExerciseClick(exerciseIndex)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">{exercise.exerciseName}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {exercise.sets.filter((s) => s.completed).length}/{exercise.sets.length}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {exercise.sets.map((set, setIndex) => (
                  <div
                    key={setIndex}
                    className={`p-2 border rounded text-sm ${
                      set.completed
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-gray-50 border-gray-200'
                    } ${
                      exerciseIndex === activeExerciseIndex && setIndex === activeSetIndex
                        ? 'ring-2 ring-blue-500'
                        : ''
                    }`}
                  >
                    <div className="font-medium">Set {set.setNumber}</div>
                    {set.completed ? (
                      <>
                        <div>
                          {formatWeightDisplay(set.weightKg, preferences)} × {set.reps} reps
                        </div>
                        {set.rpe && <div>RPE: {set.rpe}</div>}
                      </>
                    ) : (
                      <div className="text-gray-500">Not completed</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
