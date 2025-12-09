import { useParams, useNavigate } from 'react-router-dom';

import {
  RoutineHeader,
  RoutineForm,
  RoutineBuilderSkeleton,
  RoutineCannotLoad,
  RoutineNotFound,
} from '@/features/routine';

import { useGetRoutineById } from '@/hooks/routines';

import type { Routine } from '@/types/routine';

/**
 * Edit Routine Page Component
 *
 * A page for editing existing workout routines
 */
const EditRoutinePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { routine, isLoading, error } = useGetRoutineById(id || '');

  const handleSuccess = (updatedRoutine: Routine) => {
    navigate(`/routines/${updatedRoutine.id}`);
  };

  if (isLoading) return <RoutineBuilderSkeleton />;

  if (error) return <RoutineCannotLoad error={error} />;

  if (!routine) return <RoutineNotFound />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <RoutineHeader routine={routine} navigation={`/routines/${routine.id}`} />

      <RoutineForm mode="edit" existingRoutine={routine} onSuccess={handleSuccess} />
    </div>
  );
};

export default EditRoutinePage;
