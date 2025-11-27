import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { RoutineHeader } from './routine-header';

export const RoutineCannotLoad: React.FC<{ error: string }> = ({ error }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <RoutineHeader navigation="/profile?tab=routines" />

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Routine</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
