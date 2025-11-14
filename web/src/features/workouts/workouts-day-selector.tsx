import { getDayExercises, getExerciseName, formatExerciseInfo, DAYS_OF_WEEK } from '@/utils';
import type { Routine } from '@/types/api';
import type { DayInfo, ExerciseInfo } from '@/utils/helper';

interface DaySelectorProps {
  routine: Routine;
  availableDays: DayInfo[];
  selectedDayIndex: number | null;
  onDaySelect: (dayIndex: number) => void;
}

export const WorkoutDaySelector = ({
  routine,
  availableDays,
  selectedDayIndex,
  onDaySelect,
}: DaySelectorProps) => {
  return (
    <div>
      <p className="text-blue-700 text-sm mb-3">Choose which day to train:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {availableDays.map((day) => {
          const dayExercises = getDayExercises(routine, day.dayIndex);
          const isSelected = selectedDayIndex === day.dayIndex;

          return (
            <div
              key={day.dayIndex}
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => onDaySelect(day.dayIndex)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                  {day.name}
                </h4>
                <span className={`text-sm ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                  {day.exerciseCount} exercises
                </span>
              </div>

              {/* Show exercises for this day */}
              <div className="space-y-1">
                {dayExercises.slice(0, 3).map((exercise: ExerciseInfo, idx: number) => (
                  <div
                    key={idx}
                    className={`text-xs ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}
                  >
                    • {getExerciseName(exercise)}
                    {exercise.sets && exercise.reps && (
                      <span className="ml-1">({formatExerciseInfo(exercise)})</span>
                    )}
                  </div>
                ))}
                {dayExercises.length > 3 && (
                  <div className={`text-xs ${isSelected ? 'text-blue-500' : 'text-gray-400'}`}>
                    +{dayExercises.length - 3} more...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Show detailed exercises for selected day */}
      {selectedDayIndex !== null && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">
            {DAYS_OF_WEEK[selectedDayIndex]} Workout Preview
          </h4>
          <div className="space-y-2">
            {getDayExercises(routine, selectedDayIndex).map(
              (exercise: ExerciseInfo, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-blue-800">{getExerciseName(exercise)}</span>
                  <span className="text-blue-600">{formatExerciseInfo(exercise)}</span>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
