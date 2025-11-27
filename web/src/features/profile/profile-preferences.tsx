import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useUserPreferences } from '@/hooks/user/useUserPreferences';

import { getWeightUnitLabel } from '@/utils';

export const ProfilePreferences: React.FC = () => {
  const { preferences, setWeightUnit } = useUserPreferences();

  return (
    <Card className="p-6">
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
    </Card>
  );
};
