import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { DayTabs } from './routine-day-tabs';
import { ExerciseList } from './routine-exercise-list';
import { ExerciseSearch } from './routine-exercise-search';

import type { ExerciseBuilderProps } from '@/types/routine';

export const ExerciseBuilder: React.FC<ExerciseBuilderProps> = ({
  days,
  currentDayId,
  onCurrentDayChange,
  onAddExercise,
  onUpdateExercise,
  onRemoveExercise,
  onAddDay,
  onRemoveDay,
  onShowTemplates,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const currentDay = days.find((day) => day.id === currentDayId) || days[0];

  const handleAddExercise = (exerciseName: string, isCustom = false) => {
    onAddExercise(exerciseName, isCustom);
    setSearchTerm('');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Exercise Builder</h2>
        <Button type="button" variant="outline" onClick={onShowTemplates} className="text-sm">
          Load Template
        </Button>
      </div>

      {/* Day Tabs */}
      <DayTabs
        days={days}
        currentDayId={currentDayId}
        onDaySelect={onCurrentDayChange}
        onAddDay={onAddDay}
        onRemoveDay={onRemoveDay}
      />

      {/* Exercise Search */}
      <ExerciseSearch
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onAddExercise={handleAddExercise}
      />

      {/* Exercise List */}
      <ExerciseList
        currentDay={currentDay}
        onUpdateExercise={onUpdateExercise}
        onRemoveExercise={onRemoveExercise}
      />
    </Card>
  );
};
