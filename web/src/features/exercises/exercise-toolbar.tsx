import { Search, SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ExerciseFiltersComponent } from '@/features/exercises/exercise-filters';
import { SearchBar } from '@/components/search/search-bar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import type { ExerciseToolbarProps } from '@/types/exercise';

export const ExerciseToolbar: React.FC<ExerciseToolbarProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  isLoading,
  handleRefresh,
  error,
  suggestions = [],
  showDropdown = false,
  onSuggestionClick,
}) => {
  return (
    <div className="w-full flex space-x-2 flex-col md:flex-row md:items-center gap-2">
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        onSearch={onSearch}
        isLoading={isLoading}
        error={error}
        handleRefresh={handleRefresh}
        placeholder="Search exercises..."
        suggestions={suggestions}
        showDropdown={showDropdown}
        onSuggestionClick={onSuggestionClick}
        className="mr-0 md:mr-2"
      />
      <div className="flex flex-row justify-between items-center gap-0 md:gap-2">
        <Button onClick={onSearch} variant="default">
          <Search className="h-4 w-4 mr-1" />
          Search
        </Button>
        <div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Exercise Filters</SheetTitle>
                <SheetDescription>
                  Filter exercises by category, difficulty, equipment, and more to find exactly what
                  you're looking for.
                </SheetDescription>
              </SheetHeader>
              <ExerciseFiltersComponent
                filters={filters}
                onFiltersChange={onFiltersChange}
                onApplyFilters={onApplyFilters}
                onClearFilters={onClearFilters}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};
