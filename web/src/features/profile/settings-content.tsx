import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useDeactivateAccount } from '@/hooks/useDeactivateAccount';
import { useDeleteAccount } from '@/hooks/useDeleteAccount';

import { getWeightUnitLabel } from '@/utils';

export const SettingsContent = () => {
  const { preferences, setWeightUnit } = useUserPreferences();
  const { deactivateAccount } = useDeactivateAccount();
  const { deleteAccount } = useDeleteAccount();

  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleClickDeactivate = () => {
    setIsDeactivateOpen(true);
  };

  const handleClickDelete = () => {
    setIsDeleteOpen(true);
  };

  const handleCloseDeactivate = () => {
    setIsDeactivateOpen(false);
  };

  const handleCloseDelete = () => {
    setIsDeleteOpen(false);
  };

  const handleClickOutside = () => {
    setIsDeactivateOpen(false);
    setIsDeleteOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex flex-row justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-900">Weight Unit</h3>
              <p className="text-sm text-gray-500">
                Choose how weights are displayed throughout the app
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={preferences.weightUnit === 'kg' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setWeightUnit('kg')}
              >
                {getWeightUnitLabel('kg')} (kg)
              </Button>
              <Button
                variant={preferences.weightUnit === 'lbs' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setWeightUnit('lbs')}
              >
                {getWeightUnitLabel('lbs')} (lbs)
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-row justify-between items-center">
          <div>
            <h3 className="font-semibold text-red-600">Deactivate Account</h3>
            <p className="text-sm text-gray-500">
              Temporarily disable your account. You can reactivate it anytime by logging in.
            </p>
          </div>
          <Button variant="danger" onClick={handleClickDeactivate}>
            Deactivate Account
          </Button>

          <Dialog open={isDeactivateOpen} onOpenChange={handleCloseDeactivate}>
            <DialogContent onInteractOutside={handleClickOutside}>
              <DialogHeader>
                <DialogTitle>Confirm Deactivation</DialogTitle>
                <DialogDescription>
                  Are you sure you want to deactivate your account? You can reactivate it within 30
                  days by logging back in. <br />
                  <br />
                  After 30 days, your account and all associated data will be permanently deleted.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" onClick={handleCloseDeactivate}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button variant="danger" onClick={deactivateAccount}>
                  Deactivate
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-row justify-between items-center">
          <div>
            <h3 className="font-semibold text-red-600">Delete Account</h3>
            <p className="text-sm text-gray-500">
              Permanently delete your account and all data. This action cannot be undone.
            </p>
          </div>
          <Button variant="danger" onClick={handleClickDelete}>
            Delete Account
          </Button>

          <Dialog open={isDeleteOpen} onOpenChange={handleCloseDelete}>
            <DialogContent onInteractOutside={handleClickOutside}>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete your account? This action is irreversible and all
                  your data will be permanently removed.
                </DialogDescription>
                <Input
                  placeholder="Type 'DELETE' to confirm"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  required
                />
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" onClick={handleCloseDelete}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  variant="danger"
                  onClick={deleteAccount}
                  disabled={deleteConfirmation !== 'DELETE'}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};
