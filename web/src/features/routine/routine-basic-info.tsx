import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RoutineBasicInfoProps {
  title: string;
  description: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | '';
  visibility: 'PUBLIC' | 'PRIVATE' | '';
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onDifficultyChange: (value: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED') => void;
  onVisibilityChange: (value: 'PUBLIC' | 'PRIVATE') => void;
}

export const RoutineBasicInfo: React.FC<RoutineBasicInfoProps> = ({
  title,
  description,
  difficulty,
  visibility,
  onTitleChange,
  onDescriptionChange,
  onDifficultyChange,
  onVisibilityChange,
}) => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Routine Title</label>
          <Input
            placeholder="e.g., My Push/Pull/Legs Routine"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Difficulty</label>
            <Select value={difficulty} onValueChange={onDifficultyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Optional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BEGINNER">Beginner</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                <SelectItem value="ADVANCED">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Visibility</label>
            <Select value={visibility} onValueChange={onVisibilityChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Choose..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">Description (Optional)</label>
        <Input
          multiline={true}
          placeholder="Describe your routine..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>
    </Card>
  );
};
