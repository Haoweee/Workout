import { useParams, useNavigate } from 'react-router-dom';

import {
  WorkoutHeader,
  WorkoutDetailSkeleton,
  WorkoutNotFound,
  WorkoutStats,
  WorkoutStatus,
  WorkoutExerciseList,
} from '@/features/workouts';

import { useUserPreferences } from '@/hooks/user';
import { useGetWorkoutById } from '@/hooks/workouts';

const WorkoutDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const { id } = useParams<{ id: string }>();

  const { workout, isLoading: loading, debugInfo, retry } = useGetWorkoutById(id, navigate);

  if (loading) return <WorkoutDetailSkeleton />;

  if (!workout)
    return (
      <WorkoutNotFound
        id={id || 'unknown'}
        debugInfo={debugInfo}
        retry={retry}
        navigate={navigate}
      />
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <WorkoutHeader navigation="/workouts" workout={workout} />

        <WorkoutStats workout={workout} preferences={preferences} />

        {!workout.finishedAt && <WorkoutStatus workout={workout} />}

        <WorkoutExerciseList workout={workout} preferences={preferences} />
      </div>
    </div>
  );
};

export default WorkoutDetailPage;
