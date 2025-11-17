import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { formatWeightDisplay } from '@/utils';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { workoutService } from '@/services/workout.service';
import { toast } from 'sonner';
import type { OptimizedWorkout } from '@/services/workout.service';
import { useState } from 'react';

interface WorkoutOverviewProps {
  workout: OptimizedWorkout;
  activeExerciseIndex: number;
  activeSetIndex: number;
  onExerciseClick: (exerciseIndex: number) => void;
  onWorkoutUpdate?: () => void; // Callback to refresh workout data after set removal
}

export const WorkoutOverview = ({
  workout,
  activeExerciseIndex,
  activeSetIndex,
  onExerciseClick,
  onWorkoutUpdate,
}: WorkoutOverviewProps) => {
  const { preferences } = useUserPreferences();
  const [removingSetId, setRemovingSetId] = useState<string | null>(null);

  const handleRemoveSet = async (
    exerciseId: number | null,
    customExerciseName: string | null,
    setNumber: number,
    exerciseName: string,
    totalSets: number
  ) => {
    // Prevent removing the last set
    if (totalSets <= 1) {
      toast.error('Cannot remove the last set', {
        description: 'Each exercise must have at least one set',
      });
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to remove Set ${setNumber} from ${exerciseName}?`
    );
    if (!confirmed) return;

    const setId = `${exerciseId || customExerciseName}-${setNumber}`;
    setRemovingSetId(setId);

    try {
      await workoutService.deleteWorkoutSetByExercise(
        workout.id,
        exerciseId,
        customExerciseName,
        setNumber
      );

      toast.success('Set removed successfully');

      // Trigger workout data refresh
      if (onWorkoutUpdate) {
        onWorkoutUpdate();
      }
    } catch (error) {
      console.error('Error removing set:', error);
      toast.error('Failed to remove set', {
        description: 'An error occurred while trying to remove the set. Please try again.',
      });
    } finally {
      setRemovingSetId(null);
    }
  };

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
                {exercise.sets.map((set, setIndex) => {
                  const setId = `${exercise.exerciseId || exercise.exerciseName}-${set.setNumber}`;
                  const isRemoving = removingSetId === setId;

                  return (
                    <div
                      key={setIndex}
                      className={`relative p-2 border rounded text-sm ${
                        set.completed
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : 'bg-gray-50 border-gray-200'
                      } ${
                        exerciseIndex === activeExerciseIndex && setIndex === activeSetIndex
                          ? 'ring-2 ring-blue-500'
                          : ''
                      }`}
                    >
                      {/* Remove button - only show if there's more than 1 set */}
                      {exercise.sets.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute -top-1 -right-1 h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSet(
                              exercise.exerciseId,
                              exercise.isCustom ? exercise.exerciseName : null,
                              set.setNumber,
                              exercise.exerciseName,
                              exercise.sets.length
                            );
                          }}
                          disabled={isRemoving}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}

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
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
