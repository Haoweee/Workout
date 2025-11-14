import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';

type ExerciseHeaderProps = {
  handleBackClick: () => void;
};

export const ExerciseHeader = ({ handleBackClick }: ExerciseHeaderProps) => {
  return (
    <Button onClick={handleBackClick} variant="ghost" className="mb-6">
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Exercises
    </Button>
  );
};
