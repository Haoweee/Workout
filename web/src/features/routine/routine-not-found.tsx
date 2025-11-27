import { Card, CardContent } from '@/components/ui/card';

import { RoutineHeader } from './routine-header';

export const RoutineNotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <RoutineHeader navigation="/profile?tab=routines" />

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Routine Not Found</h2>
              <p className="text-gray-600 mb-4">
                The routine you're looking for doesn't exist or has been removed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
