import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { popularExercises } from '@/constants/routine-templates';

interface ExerciseSearchProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onAddExercise: (name: string, isCustom?: boolean) => void;
}

export const ExerciseSearch: React.FC<ExerciseSearchProps> = ({
  searchTerm,
  onSearchTermChange,
  onAddExercise,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchTerm.trim()) {
        onAddExercise(searchTerm.trim(), true);
      }
    }
  };

  return (
    <div className="mb-6">
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Type exercise name to add quickly..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          {searchTerm && (
            <Button
              type="button"
              size="sm"
              onClick={() => onAddExercise(searchTerm.trim(), true)}
              className="absolute right-1 top-1 h-8"
            >
              Add
            </Button>
          )}
        </div>
      </div>

      {/* Popular Exercises Quick Add */}
      <div className="flex flex-wrap gap-2">
        {popularExercises.slice(0, 8).map((exercise) => (
          <Button
            key={exercise.name}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAddExercise(exercise.name)}
            className="text-xs"
          >
            {exercise.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
