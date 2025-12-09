import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/icons';

import { Button } from '@/components/ui/button';

import type { ExerciseNavigationProps } from '@/types/workout';

export const WorkoutExerciseNavigation: React.FC<ExerciseNavigationProps> = ({
  currentExerciseIndex,
  totalExercises,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="flex justify-between mb-6">
      <Button variant="outline" onClick={onPrevious} disabled={currentExerciseIndex === 0}>
        <ChevronLeftIcon className="mr-2 h-4 w-4" />
        Previous Exercise
      </Button>

      <div className="text-center">
        <div className="text-sm text-gray-600">Exercise</div>
        <div className="font-medium">
          {currentExerciseIndex + 1} of {totalExercises}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={onNext}
        disabled={currentExerciseIndex === totalExercises - 1}
      >
        Next Exercise
        <ChevronRightIcon className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};
