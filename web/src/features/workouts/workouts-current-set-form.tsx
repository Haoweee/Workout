import { DumbbellIcon, CheckIcon, ClockIcon as Timer } from '@/components/ui/icons';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { useUserPreferences } from '@/hooks/user/useUserPreferences';

import type { CurrentSetFormProps } from '@/types/workout';

import { displayWeight } from '@/utils';

export const WorkoutCurrentSetForm: React.FC<CurrentSetFormProps> = ({
  exercise,
  currentSet,
  activeSetIndex,
  currentWeight,
  setCurrentWeight,
  currentReps,
  setCurrentReps,
  currentRPE,
  setCurrentRPE,
  currentNotes,
  setCurrentNotes,
  saving,
  onLogSet,
  onStartRestTimer,
  showRestTimer,
}) => {
  const { preferences } = useUserPreferences();

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DumbbellIcon className="h-5 w-5" />
            {exercise.exerciseName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              Set {activeSetIndex + 1} of {exercise.sets.length}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Weight ({preferences.weightUnit})
            </label>
            <Input
              type="number"
              step="0.5"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              placeholder={displayWeight(currentSet.weightKg, preferences)}
              className="text-center"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Reps</label>
            <Input
              type="number"
              value={currentReps}
              onChange={(e) => setCurrentReps(e.target.value)}
              placeholder={currentSet.reps?.toString() || '0'}
              className="text-center"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">RPE (1-10)</label>
            <Input
              type="number"
              min="1"
              max="10"
              value={currentRPE}
              onChange={(e) => setCurrentRPE(e.target.value)}
              placeholder={currentSet.rpe?.toString() || ''}
              className="text-center"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Notes</label>
            <Input
              value={currentNotes}
              onChange={(e) => setCurrentNotes(e.target.value)}
              placeholder={currentSet.notes || 'Optional'}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onLogSet}
            disabled={saving || (!currentWeight && !currentReps)}
            className="flex-1"
          >
            <CheckIcon className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Complete Set'}
          </Button>
          <Button variant="outline" onClick={onStartRestTimer} disabled={showRestTimer}>
            <Timer className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
