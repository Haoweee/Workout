import { Card, CardContent } from '@/components/ui/card';

import type { CompletionMessageProps } from '@/types/workout';

export const WorkoutCompletionMessage: React.FC<CompletionMessageProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <Card className="mb-6 border-green-500 bg-green-50">
      <CardContent className="pt-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">🎉 Workout Complete!</div>
          <p className="text-green-700 mb-4">Congratulations! You've completed all sets.</p>
          <p className="text-sm text-green-600">Finishing workout automatically...</p>
        </div>
      </CardContent>
    </Card>
  );
};
