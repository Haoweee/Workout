import { WorkoutTableSkeleton } from '@/features/workouts/workouts-table-loader';
import { WorkoutTable } from '@/components/charts/workouts-table';

import { useGetUserWorkouts } from '@/hooks/useGetUserWorkouts';

export const WorkoutsPage: React.FC = () => {
  const { workouts, isLoading, error } = useGetUserWorkouts(15);

  if (isLoading) return <WorkoutTableSkeleton />;

  return (
    <div className="min-h-screen bg-gray-50 max-w-[95%] mx-auto">
      <WorkoutTable data={workouts} error={error} />
    </div>
  );
};
