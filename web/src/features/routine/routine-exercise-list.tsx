import React from 'react';

import { Trash2Icon, ActivityIcon } from '@/components/ui/icons';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import type { ExerciseListProps } from '@/types/routine';

export const ExerciseList: React.FC<ExerciseListProps> = ({
  currentDay,
  onUpdateExercise,
  onRemoveExercise,
}) => {
  // Rest time presets
  const restPresets = [30, 60, 90, 120, 180];

  if (!currentDay) return null;

  return (
    <div>
      <h3 className="font-medium mb-3">
        {currentDay.name} ({currentDay.exercises.length || 0} exercises)
      </h3>

      {currentDay.exercises.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <ActivityIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No exercises added yet</p>
          <p className="text-gray-400 text-xs">
            Search above or click a popular exercise to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentDay.exercises.map((exercise) => (
            <Card key={exercise.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{exercise.name}</span>
                    {exercise.isCustom && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        Custom
                      </span>
                    )}
                  </div>
                </div>

                {/* Inline Exercise Configuration */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <label className="text-xs text-gray-500 mb-1">Sets</label>
                    <Input
                      value={exercise.sets}
                      onChange={(e) => onUpdateExercise(exercise.id, 'sets', e.target.value)}
                      className="w-16 text-center"
                      placeholder="3"
                    />
                  </div>

                  <div className="text-gray-400">×</div>

                  <div className="flex flex-col items-center">
                    <label className="text-xs text-gray-500 mb-1">Reps</label>
                    <Input
                      value={exercise.reps}
                      onChange={(e) => onUpdateExercise(exercise.id, 'reps', e.target.value)}
                      className="w-20 text-center"
                      placeholder="8-10"
                    />
                  </div>

                  <div className="flex flex-col items-center">
                    <label className="text-xs text-gray-500 mb-1">Rest (sec)</label>
                    <div className="flex items-center gap-1">
                      <Input
                        value={exercise.rest}
                        onChange={(e) => onUpdateExercise(exercise.id, 'rest', e.target.value)}
                        className="w-16 text-center"
                        placeholder="90"
                      />
                      <div className="flex flex-col gap-1">
                        {restPresets.map((preset) => (
                          <Button
                            key={preset}
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onUpdateExercise(exercise.id, 'rest', preset.toString())}
                            className="h-6 w-8 text-xs p-0"
                            title={`${preset}s`}
                          >
                            {preset}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveExercise(exercise.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
