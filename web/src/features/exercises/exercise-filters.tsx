import { useState, useEffect } from 'react';

import { XIcon } from '@/components/ui/icons';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { exerciseService } from '@/services/exercises.service';

import type { ExerciseFilters, FilterOptions, ExerciseFiltersProps } from '@/types/exercise';

export const ExerciseFiltersComponent: React.FC<ExerciseFiltersProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
}) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    levels: [],
    muscleGroups: [],
    equipmentTypes: [],
    forceTypes: [],
    mechanicTypes: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      setLoading(true);
      const result = await exerciseService.getFilterOptions();
      setFilterOptions(result);
    } catch (error) {
      console.error('Failed to fetch filter options:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: keyof ExerciseFilters, value: string | string[] | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleMuscleGroup = (muscle: string) => {
    const currentMuscles = filters.primaryMuscles || [];
    const newMuscles = currentMuscles.includes(muscle)
      ? currentMuscles.filter((m) => m !== muscle)
      : [...currentMuscles, muscle];

    updateFilter('primaryMuscles', newMuscles.length > 0 ? newMuscles : undefined);
  };

  const removeMuscleGroup = (muscle: string) => {
    const newMuscles = (filters.primaryMuscles || []).filter((m) => m !== muscle);
    updateFilter('primaryMuscles', newMuscles.length > 0 ? newMuscles : undefined);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) =>
      value !== undefined && value !== '' && (Array.isArray(value) ? value.length > 0 : true)
  );

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Category Filter */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={filters.category || 'all'}
          onValueChange={(value: string) =>
            updateFilter('category', value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {filterOptions.categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0) + category.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Difficulty Level Filter */}
      <div className="space-y-2">
        <Label>Difficulty Level</Label>
        <Select
          value={filters.level || 'all'}
          onValueChange={(value: string) =>
            updateFilter('level', value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {filterOptions.levels.map((level) => (
              <SelectItem key={level} value={level}>
                {level.charAt(0) + level.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Equipment Filter */}
      <div className="space-y-2">
        <Label>Equipment</Label>
        <Select
          value={filters.equipment || 'all'}
          onValueChange={(value: string) =>
            updateFilter('equipment', value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select equipment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Equipment</SelectItem>
            {filterOptions.equipmentTypes.map((equipment) => (
              <SelectItem key={equipment} value={equipment}>
                {equipment}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Force Type Filter */}
      <div className="space-y-2">
        <Label>Force Type</Label>
        <Select
          value={filters.force || 'all'}
          onValueChange={(value: string) =>
            updateFilter('force', value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select force type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Force Types</SelectItem>
            {filterOptions.forceTypes.map((force) => (
              <SelectItem key={force} value={force}>
                {force.charAt(0) + force.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mechanic Type Filter */}
      <div className="space-y-2">
        <Label>Mechanic Type</Label>
        <Select
          value={filters.mechanic || 'all'}
          onValueChange={(value: string) =>
            updateFilter('mechanic', value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select mechanic type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Mechanic Types</SelectItem>
            {filterOptions.mechanicTypes.map((mechanic) => (
              <SelectItem key={mechanic} value={mechanic}>
                {mechanic.charAt(0) + mechanic.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Muscle Groups Filter */}
      <div className="space-y-3">
        <Label>Primary Muscle Groups</Label>

        {/* Selected muscle groups */}
        {filters.primaryMuscles && filters.primaryMuscles.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.primaryMuscles.map((muscle) => (
              <Badge key={muscle} variant="secondary" className="flex items-center gap-1">
                {muscle}
                <XIcon
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => removeMuscleGroup(muscle)}
                />
              </Badge>
            ))}
          </div>
        )}

        {/* Muscle group checkboxes */}
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
          {filterOptions.muscleGroups.map((muscle) => (
            <div key={muscle} className="flex items-center space-x-2">
              <Checkbox
                id={muscle}
                checked={filters.primaryMuscles?.includes(muscle) || false}
                onCheckedChange={() => toggleMuscleGroup(muscle)}
              />
              <Label htmlFor={muscle} className="text-sm font-normal cursor-pointer capitalize">
                {muscle}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col space-y-2 pt-4 border-t">
        <Button onClick={onApplyFilters} className="w-full">
          Apply Filters
        </Button>
        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearFilters} className="w-full">
            Clear All Filters
          </Button>
        )}
      </div>
    </div>
  );
};
