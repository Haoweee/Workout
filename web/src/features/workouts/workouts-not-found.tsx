import { Button } from '@/components/ui/button';

type WorkoutNotFoundProps = {
  id: string;
  debugInfo: string;
  retry: () => void;
  navigate: (path: string) => void;
};

export const WorkoutNotFound: React.FC<WorkoutNotFoundProps> = ({
  id,
  debugInfo,
  retry,
  navigate,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Workout not found</h2>
        <p className="text-gray-600 mb-4">
          The workout with ID "{id}" could not be loaded. This might be because:
        </p>
        <ul className="text-left text-sm text-gray-600 mb-6 space-y-1">
          <li>• The workout doesn't exist</li>
          <li>• You don't have permission to view it</li>
          <li>• There's a server connection issue</li>
          <li>• The workout was deleted</li>
        </ul>

        {/* Debug Information */}
        <div className="bg-gray-100 p-3 rounded-lg mb-6 text-left">
          <h4 className="font-semibold text-sm text-gray-700 mb-1">Debug Info:</h4>
          <p className="text-xs text-gray-600">{debugInfo}</p>
          <p className="text-xs text-gray-600 mt-1">Check browser console for more details.</p>
        </div>

        <div className="space-y-2">
          <Button onClick={() => navigate('/workouts')}>Go to Workouts List</Button>
          <Button variant="outline" onClick={retry}>
            Retry Loading
          </Button>
        </div>
      </div>
    </div>
  );
};
