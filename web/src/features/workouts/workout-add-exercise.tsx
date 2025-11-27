import React, { useState } from 'react';

import { Plus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { popularExercises } from '@/constants/routine-templates';

import type { WorkoutAddExerciseProps } from '@/types/workout';

export const WorkoutAddExercise: React.FC<WorkoutAddExerciseProps> = ({
  onAddExercise,
  isVisible,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchTerm.trim()) {
        onAddExercise(searchTerm.trim(), true);
        setSearchTerm('');
        onClose();
      }
    }
  };

  const handleAddCustomExercise = () => {
    if (searchTerm.trim()) {
      onAddExercise(searchTerm.trim(), true);
      setSearchTerm('');
      onClose();
    }
  };

  const handleAddPopularExercise = (exerciseName: string) => {
    onAddExercise(exerciseName, false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Add Exercise</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search/Custom Exercise Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Search or enter custom exercise name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleAddCustomExercise} disabled={!searchTerm.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Popular Exercises */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Exercises</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {popularExercises.slice(0, 8).map((exercise) => (
                <Button
                  key={exercise.name}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddPopularExercise(exercise.name)}
                  className="justify-start text-left h-auto py-2"
                >
                  {exercise.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
