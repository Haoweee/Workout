import { useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  WorkoutHeader,
  WorkoutRestTimer,
  WorkoutCurrentSetForm,
  WorkoutExerciseNavigation,
  WorkoutOverview,
  WorkoutCompletionMessage,
  WorkoutDetailSkeleton,
  // WorkoutNotFound,
} from '@/features/workouts';

import { useActiveWorkout } from '@/hooks/useActiveWorkout';

export const ActiveWorkoutPage = () => {
  const { id } = useParams<{ id: string }>();

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
  } = useActiveWorkout({ workoutId: id });

  if (loading) return <WorkoutDetailSkeleton />;

  // ! reuse WorkoutNotFound component
  if (!workout) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Workout not found</h1>
          <Button onClick={() => window.history.back()} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
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

      {/* Current Exercise */}
      {currentExercise && currentSet && (
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
      )}

      {/* Exercise Navigation */}
      <WorkoutExerciseNavigation
        currentExerciseIndex={activeExerciseIndex}
        totalExercises={workout.exercises.length}
        onPrevious={navigateToPrevExercise}
        onNext={navigateToNextExercise}
      />

      {/* All Exercises Overview */}
      <WorkoutOverview
        workout={workout}
        activeExerciseIndex={activeExerciseIndex}
        activeSetIndex={activeSetIndex}
        onExerciseClick={navigateToExercise}
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
            <Check className="mr-2 h-4 w-4" />
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
            <Check className="mr-2 h-4 w-4" />
            {finishing ? 'Finishing...' : 'Finish Workout Early'}
          </Button>
        )}
      </div>
    </div>
  );
};
