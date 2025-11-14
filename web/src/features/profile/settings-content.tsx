import { Button } from '@/components/ui/button';

import { useUserPreferences } from '@/hooks/useUserPreferences';

import { getWeightUnitLabel } from '@/utils';

export const SettingsContent = () => {
  const { preferences, setWeightUnit } = useUserPreferences();
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
          <Button variant="danger">Deactivate Account</Button>
        </div>

        <div className="flex flex-row justify-between items-center">
          <div>
            <h3 className="font-semibold text-red-600">Delete Account</h3>
            <p className="text-sm text-gray-500">
              Permanently delete your account and all data. This action cannot be undone.
            </p>
          </div>
          <Button variant="danger">Delete Account</Button>
        </div>
      </div>
    </>
  );
};
