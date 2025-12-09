import { ArrowLeftIcon } from '@/components/ui/icons';

import { Button } from '@/components/ui/button';

import type { ClickBackProps } from '@/types/shared';

export const ExerciseHeader: React.FC<ClickBackProps> = ({ handleBackClick }) => {
  return (
    <Button onClick={handleBackClick} variant="ghost" className="mb-6">
      <ArrowLeftIcon className="mr-2 h-4 w-4" />
      Back to Exercises
    </Button>
  );
};
