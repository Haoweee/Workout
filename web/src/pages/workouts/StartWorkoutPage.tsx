import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  WorkoutHeader,
  WorkoutSelectedRoutine,
  WorkoutRoutineList,
  WorkoutStartWorkoutSkeleton,
} from '@/features/workouts';

import { useStartWorkout } from '@/hooks/workouts';

const StartWorkoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routineId = searchParams.get('routineId');

  const {
    // State
    searchTerm,
    setSearchTerm,
    selectedRoutine,
    selectedDayIndex,
    setSelectedDayIndex,
    creating,

    // Data
    routines,
    routineLoading,

    // Actions
    handleRoutineSelect,
    handleStartRoutineWorkout,
    handleQuickStart,
  } = useStartWorkout({ routineId });

  if (routineLoading) {
    return <WorkoutStartWorkoutSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <WorkoutHeader
          navigation={-1}
          type="start"
          handleQuickStart={handleQuickStart}
          creating={creating}
        />

        {/* Pre-selected Routine */}
        {selectedRoutine && (
          <WorkoutSelectedRoutine
            routine={selectedRoutine}
            selectedDayIndex={selectedDayIndex}
            onDaySelect={setSelectedDayIndex}
            onStartWorkout={handleStartRoutineWorkout}
            creating={creating}
          />
        )}

        {/* Choose from Routines */}
        <WorkoutRoutineList
          routines={routines}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onRoutineSelect={handleRoutineSelect}
          onCreateRoutine={() => navigate('/routines/create')}
          creating={creating}
        />
      </div>
    </div>
  );
};

export default StartWorkoutPage;
