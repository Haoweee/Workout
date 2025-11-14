import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Target, Users, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ErrorToast } from '@/components/errors/toast';

import {
  RoutineHeader,
  RoutineExerciseDisplay,
  RoutineDelete,
  RoutineDetailSkeleton,
  RoutineCannotLoad,
  RoutineNotFound,
} from '@/features/routine';

import { useAuth } from '@/hooks/useAuth';
import { useGetRoutineById } from '@/hooks/useGetRoutineById';
import { useCloneRoutine } from '@/hooks/useCloneRoutine';

import { getDifficultyColor } from '@/utils';

/**
 * Routine Detail Page Component
 *
 * Displays detailed information about a specific routine including:
 * - Routine metadata (name, description, difficulty, etc.)
 * - Exercise list with sets and reps
 * - Actions (start workout, edit, etc.)
 */
export const RoutineDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { id } = useParams<{ id: string }>();
  const { routine, isLoading, error } = useGetRoutineById(id || '');

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const openDeleteDialog = () => {
    setShowDeleteDialog(true);
  };

  // Check if the current user is the author of this routine
  const isOwner = user && routine && user.id === routine.authorId;

  const { cloneRoutine } = useCloneRoutine();

  const handleStartWorkout = () => {
    if (routine) navigate(`/workouts/new?routineId=${routine.id}`);
  };

  const handleEditRoutine = () => {
    if (routine) navigate(`/routines/${routine.id}/edit`);
  };

  const handleCopyRoutine = async () => {
    if (!routine) return;

    try {
      // Use the server's clone endpoint to create a copy
      const newRoutine = await cloneRoutine(routine.id, `${routine.title} (Copy)`);

      if (newRoutine) {
        // Navigate to the newly created routine
        navigate(`/routines/${newRoutine.id}`);
      }
    } catch (err) {
      console.error('Failed to copy routine:', err);
      ErrorToast({
        message: 'Error Copying Routine',
        description: 'An error occurred while trying to copy the routine.',
      });
    }
  };

  if (isLoading) return <RoutineDetailSkeleton />;

  if (error) return <RoutineCannotLoad error={error} />;

  if (!routine) return <RoutineNotFound />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <RoutineHeader routine={routine} showAvatar={true} navigation={'/profile?tab=routines'} />

          {routine.description && (
            <p className="text-gray-600 mb-4 max-w-2xl">{routine.description}</p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {routine.difficulty && (
              <Badge className={getDifficultyColor(routine.difficulty)}>
                <Target className="h-3 w-3 mr-1" />
                {routine.difficulty}
              </Badge>
            )}
            {routine.visibility && (
              <Badge variant="outline">
                <Users className="h-3 w-3 mr-1" />
                {routine.visibility === 'PUBLIC' ? 'Public' : 'Private'}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row justify-between items-center">
            <div className="flex gap-3">
              <Button
                onClick={handleStartWorkout}
                disabled={!isAuthenticated}
                className={!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}
              >
                Start Workout
              </Button>
              {isOwner ? (
                // Owner buttons
                <Button variant="outline" onClick={handleEditRoutine}>
                  Edit Routine
                </Button>
              ) : (
                // Non-owner buttons - only show if authenticated
                <Button
                  variant="outline"
                  onClick={handleCopyRoutine}
                  disabled={!isAuthenticated}
                  className={!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Routine
                </Button>
              )}
            </div>
            {isOwner && (
              <Button variant="destructive" onClick={openDeleteDialog}>
                Delete
              </Button>
            )}
          </div>
        </div>

        <RoutineExerciseDisplay routine={routine} />

        <RoutineDelete
          routine={routine}
          showDeleteDialog={showDeleteDialog}
          setShowDeleteDialog={setShowDeleteDialog}
        />
      </div>
    </div>
  );
};
