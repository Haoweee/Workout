import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExerciseNavigationProps {
  currentExerciseIndex: number;
  totalExercises: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const WorkoutExerciseNavigation = ({
  currentExerciseIndex,
  totalExercises,
  onPrevious,
  onNext,
}: ExerciseNavigationProps) => {
  return (
    <div className="flex justify-between mb-6">
      <Button variant="outline" onClick={onPrevious} disabled={currentExerciseIndex === 0}>
        <ChevronLeft className="mr-2 h-4 w-4" />
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
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};
