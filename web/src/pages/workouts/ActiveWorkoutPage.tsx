import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { ArrowLeftIcon, CheckIcon, PlusIcon } from '@/components/ui/icons';

import { Button } from '@/components/ui/button';

import {
  WorkoutHeader,
  WorkoutRestTimer,
  WorkoutCurrentSetForm,
  WorkoutExerciseNavigation,
  WorkoutOverview,
  WorkoutCompletionMessage,
  WorkoutDetailSkeleton,
} from '@/features/workouts';
import { WorkoutAddExercise } from '@/features/workouts/workout-add-exercise';

import { useActiveWorkout } from '@/hooks/workouts';

const ActiveWorkoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showAddExercise, setShowAddExercise] = useState(false);

  const {
    // State
    workout,
    loading,
    finishing,
    showCompletionMessage,
    activeExerciseIndex,
    activeSetIndex,
    currentWeight,
    setCurrentWeight,
    currentReps,
    setCurrentReps,
    currentRPE,
    setCurrentRPE,
    currentNotes,
    setCurrentNotes,
    startTime,
    currentTime,
    showRestTimer,
    restTimeRemaining,
    restTimerRunning,
    saving,

    // Derived values
    currentExercise,
    currentSet,
    progress,

    // Actions
    logCurrentSet,
    startRestTimer,
    toggleRestTimer,
    skipRestTimer,
    finishWorkout,
    navigateToExercise,
    navigateToPrevExercise,
    navigateToNextExercise,
    addExercise,
    addSetToCurrentExercise,
    refreshWorkout,
  } = useActiveWorkout({ workoutId: id });

  if (loading) return <WorkoutDetailSkeleton />;

  // ! reuse WorkoutNotFound component
  if (!workout) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Workout not found</h1>
          <Button onClick={() => window.history.back()} className="mt-4">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <WorkoutHeader
        navigation={`/workouts/${id}`}
        type="active"
        workout={workout}
        progress={progress}
        startTime={startTime}
        currentTime={currentTime}
      />

      {/* Rest Timer */}
      <WorkoutRestTimer
        isVisible={showRestTimer}
        timeRemaining={restTimeRemaining}
        isRunning={restTimerRunning}
        onToggle={toggleRestTimer}
        onSkip={skipRestTimer}
      />

      {/* Completion Message */}
      <WorkoutCompletionMessage isVisible={showCompletionMessage} />

      {/* Add Exercise Component */}
      <WorkoutAddExercise
        isVisible={showAddExercise}
        onAddExercise={addExercise}
        onClose={() => setShowAddExercise(false)}
      />

      {/* Add Exercise Button - Show when no exercises or when user wants to add more */}
      {(!workout?.exercises || workout.exercises.length === 0 || !currentExercise) && (
        <div className="mb-6">
          <Button
            onClick={() => setShowAddExercise(true)}
            variant="outline"
            className="w-full"
            disabled={saving}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Exercise to Workout
          </Button>
        </div>
      )}

      {/* Current Exercise */}
      {currentExercise && currentSet && (
        <>
          <WorkoutCurrentSetForm
            exercise={currentExercise}
            currentSet={currentSet}
            activeSetIndex={activeSetIndex}
            currentWeight={currentWeight}
            setCurrentWeight={setCurrentWeight}
            currentReps={currentReps}
            setCurrentReps={setCurrentReps}
            currentRPE={currentRPE}
            setCurrentRPE={setCurrentRPE}
            currentNotes={currentNotes}
            setCurrentNotes={setCurrentNotes}
            saving={saving}
            onLogSet={logCurrentSet}
            onStartRestTimer={startRestTimer}
            showRestTimer={showRestTimer}
          />

          {/* Add/Remove Set Buttons */}
          <div className="mb-4 flex justify-center gap-2">
            <Button onClick={addSetToCurrentExercise} variant="outline" size="sm" disabled={saving}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Set
            </Button>

            {/* TODO: Enable when set removal is implemented with proper set ID tracking */}
            {/* currentExercise.sets.length > 1 && (
              <Button
                onClick={() => {
                  if (currentSet?.setNumber && confirm('Are you sure you want to remove this set?')) {
                    removeSetFromCurrentExercise(currentSet.setNumber);
                  }
                }}
                variant="outline"
                size="sm"
                disabled={saving}
                className="text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Set
              </Button>
            ) */}
          </div>
        </>
      )}

      {/* Exercise Navigation */}
      <WorkoutExerciseNavigation
        currentExerciseIndex={activeExerciseIndex}
        totalExercises={workout.exercises.length}
        onPrevious={navigateToPrevExercise}
        onNext={navigateToNextExercise}
      />

      {/* Add More Exercises Button */}
      {workout?.exercises && workout.exercises.length > 0 && (
        <div className="mb-4 text-center">
          <Button
            onClick={() => setShowAddExercise(true)}
            variant="outline"
            size="sm"
            disabled={saving}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Exercise
          </Button>
        </div>
      )}

      {/* All Exercises Overview */}
      <WorkoutOverview
        workout={workout}
        activeExerciseIndex={activeExerciseIndex}
        activeSetIndex={activeSetIndex}
        onExerciseClick={navigateToExercise}
        onWorkoutUpdate={refreshWorkout}
      />

      {/* Finish Workout Button */}
      <div className="mt-6 text-center space-y-3">
        {progress.completed === progress.total && progress.total > 0 ? (
          <Button
            size="lg"
            onClick={finishWorkout}
            disabled={finishing}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckIcon Icon className="mr-2 h-4 w-4" />
            {finishing ? 'Finishing Workout...' : 'Workout Complete!'}
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => {
              if (
                confirm(
                  'Are you sure you want to finish this workout early? Your progress will be saved.'
                )
              ) {
                finishWorkout();
              }
            }}
            disabled={finishing}
            className="text-gray-600 hover:text-gray-800"
          >
            <CheckIcon Icon className="mr-2 h-4 w-4" />
            {finishing ? 'Finishing...' : 'Finish Workout Early'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ActiveWorkoutPage;
