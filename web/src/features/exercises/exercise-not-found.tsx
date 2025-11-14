import { Button } from '@/components/ui/button';

import { ExerciseHeader } from './exercise-header';

type ExerciseNotFoundProps = {
  error: string | null;
  handleBackClick: () => void;
  handleRefresh: () => void;
};

export const ExerciseNotFound = ({
  error,
  handleBackClick,
  handleRefresh,
}: ExerciseNotFoundProps) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Error Loading Exercise</h2>
        <p>{error || 'Exercise not found'}</p>
        <div className="mt-4 flex gap-2">
          <ExerciseHeader handleBackClick={handleBackClick} />
          <Button onClick={handleRefresh} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};
