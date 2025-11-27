import { useParams, useNavigate, useLocation } from 'react-router-dom';

import {
  ExerciseHeader,
  ExerciseDetailCard,
  ExerciseDetailSkeleton,
  ExerciseNotFound,
} from '@/features/exercises';

import { useGetExerciseDetail } from '@/hooks/exercises';

export const ExerciseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { exercise, isLoading, error, handleRefresh } = useGetExerciseDetail(id);

  const handleBackClick = () => {
    // If navigated from a routine, go back to that routine
    const fromRoutine = location.state?.fromRoutineId;
    const fromExercise = location.state?.fromExerciseId;
    if (fromRoutine) {
      navigate(`/routines/${fromRoutine}`, {
        state: { scrollToExerciseId: fromExercise },
      });
    } else {
      navigate('/exercises');
    }
  };

  if (isLoading) return <ExerciseDetailSkeleton handleBackClick={handleBackClick} />;

  if (error || !exercise)
    return (
      <ExerciseNotFound
        error={error}
        handleBackClick={handleBackClick}
        handleRefresh={handleRefresh}
      />
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ExerciseHeader handleBackClick={handleBackClick} />
      <ExerciseDetailCard exercise={exercise} />
    </div>
  );
};
