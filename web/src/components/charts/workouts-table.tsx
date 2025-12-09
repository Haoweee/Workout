import { CircleCheckIcon, ClockIcon, DumbbellIcon, PlusIcon } from '@/components/ui/icons';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Workout } from '@/types/workout';
import {
  formatDuration,
  formatDate,
  calculateWorkoutDuration,
  formatTimeStart,
  formatWorkoutTitle,
} from '@/utils';

interface WorkoutTableProps {
  conciseTable?: boolean;
  data: Workout[];
  error?: Error | null;
}

export function WorkoutTable({ data, conciseTable = false, error }: WorkoutTableProps) {
  const navigate = useNavigate();

  return (
    <Card className="h-full flex flex-col p-6">
      <CardHeader className="p-0 flex flex-col md:flex-row justify-between">
        <div className="flex flex-col gap-2">
          <CardTitle className="leading-none font-semibold flex items-center gap-2">
            <DumbbellIcon className="h-5 w-5 text-blue-600" />
            {conciseTable ? 'Recent Workouts' : 'All Workouts'}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {conciseTable ? 'Your latest workout activities' : 'A list of all your workouts'}
          </CardDescription>
        </div>
        <div className="flex flex-row gap-2 md:gap-3 w-full md:w-auto mt-2 md:items-center md:mt-0">
          <Button
            onClick={() => navigate('/workouts/new')}
            className="bg-blue-600 hover:bg-blue-700 flex-1"
            size="sm"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Start Workout
          </Button>

          <Button
            onClick={() => navigate('/workouts')}
            variant="outline"
            className="text-sm flex-1"
            size="sm"
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <div className="flex-1">
        {error ? (
          <div className="text-center py-8 text-red-600">
            <h3 className="text-lg font-semibold mb-2">Error</h3>
            <p>{error.message}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No workouts yet</h3>
            <p className="text-gray-600 mb-4">
              Start your fitness journey by creating your first workout!
            </p>
            <Button
              onClick={() => navigate('/workouts/new')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Start Your First Workout
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Workout</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((workout) => (
                <TableRow key={workout.id} onClick={() => navigate(`/workouts/${workout.id}`)}>
                  <TableCell>{formatDate(workout.startedAt)}</TableCell>
                  <TableCell>{formatTimeStart(workout.startedAt)}</TableCell>
                  <TableCell>{formatWorkoutTitle(workout.title)}</TableCell>
                  <TableCell>{formatDuration(calculateWorkoutDuration(workout))}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      {workout.finishedAt ? (
                        <CircleCheckIcon className="h-4 w-4 text-green-500" />
                      ) : (
                        <ClockIcon className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Card>
  );
}
