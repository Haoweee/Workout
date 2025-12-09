import {
  ExerciseToolbar,
  ExerciseCard,
  ExercisePagination,
  ExerciseSkeleton,
} from '@/features/exercises';

import { useGetAllExercises } from '@/hooks/exercises';

const ExercisesPage = () => {
  const {
    exercises,
    pagination,
    isLoading,
    error,
    searchTerm,
    filters,
    goToPage,
    nextPage,
    prevPage,
    applyFilters,
    clearFilters,
    updateSearchTerm,
    updateFilters,
    performSearch,
    handleRefresh,
  } = useGetAllExercises();

  console.log('exercises:', exercises);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Exercise Database</h1>
        <ExerciseToolbar
          searchTerm={searchTerm}
          onSearchChange={updateSearchTerm}
          onSearch={performSearch}
          filters={filters}
          onFiltersChange={updateFilters}
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
          isLoading={isLoading}
          handleRefresh={handleRefresh}
          error={error}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: pagination.limit }).map((_, index) => (
              <ExerciseSkeleton key={index} />
            ))
          : exercises.map((exercise) => <ExerciseCard key={exercise.id} exercise={exercise} />)}
      </div>

      {error && <div className="w-full font-semibold text-center">No Exercises found</div>}

      {exercises.length > 0 && pagination.total > 0 && (
        <ExercisePagination
          goToPage={goToPage}
          nextPage={nextPage}
          prevPage={prevPage}
          pagination={pagination}
        />
      )}
    </div>
  );
};

export default ExercisesPage;
