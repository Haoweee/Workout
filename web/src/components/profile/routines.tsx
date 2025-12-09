import { useNavigate } from 'react-router-dom';

import { DumbbellIcon, PlusIcon } from '@/components/ui/icons';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';

import type { Routine } from '@/types/routine';

export const RoutinesTab = ({
  routines,
  refreshRoutines,
  isLoading,
  error,
}: {
  routines: Routine[];
  refreshRoutines: () => void;
  isLoading: boolean;
  error: string | null;
}) => {
  const navigate = useNavigate();

  const handleRoutineClick = (routineId: string) => {
    navigate(`/routines/${routineId}`);
  };

  const handleCreateNewRoutineClick = () => {
    navigate('/routines/create');
  };

  return (
    <TabsContent value="routines" className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">My Routines</h3>
        <Button
          onClick={() => {
            handleCreateNewRoutineClick();
          }}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          New Routine
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-3" />
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-2/3" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={refreshRoutines} variant="outline">
            Try Again
          </Button>
        </Card>
      ) : routines.length === 0 ? (
        <Card className="p-6 text-center">
          <DumbbellIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Routines Yet</h4>
          <p className="text-gray-500 mb-4">
            You haven't created any workout routines yet. Start building your fitness journey!
          </p>
          <Button variant="default" onClick={handleCreateNewRoutineClick}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Your First Routine
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routines.map((routine) => (
            <div
              key={routine.id}
              className="cursor-pointer"
              onClick={() => handleRoutineClick(routine.id)}
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 truncate">{routine.title}</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {routine.difficulty}
                  </span>
                </div>
                {routine.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{routine.description}</p>
                )}
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{routine.routineExercises?.length || 0} exercises</span>
                  <span>{routine.visibility === 'PUBLIC' ? 'Public' : 'Private'}</span>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </TabsContent>
  );
};
