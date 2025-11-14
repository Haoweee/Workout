import { useNavigate } from 'react-router-dom';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ErrorToast } from '@/components/errors/toast';

import { useDeleteRoutine } from '@/hooks/useDeleteRoutine';

import type { Routine } from '@/types/api';

export const RoutineDelete: React.FC<{
  routine: Routine;
  showDeleteDialog: boolean;
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ routine, showDeleteDialog, setShowDeleteDialog }) => {
  const navigate = useNavigate();
  const { deleteRoutine } = useDeleteRoutine();

  const handleDeleteRoutine = async () => {
    if (!routine) return;

    try {
      await deleteRoutine(routine.id);
      navigate('/profile?tab=routines');
    } catch (err) {
      console.error('Failed to delete routine:', err);
      ErrorToast({
        message: 'Error deleting routine',
        description: 'An error occurred while trying to delete the routine.',
      });
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false);
  };

  return (
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Routine</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{routine?.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={closeDeleteDialog}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteRoutine}>
            Delete Routine
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
