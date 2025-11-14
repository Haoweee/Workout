import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import type { ExerciseResponse } from '@/types/api';

export const ExerciseCard: React.FC<{ exercise: ExerciseResponse }> = ({ exercise }) => {
  const navigate = useNavigate();

  const handleExerciseClick = (exerciseId: number) => {
    navigate(`/exercises/${exerciseId}`);
  };

  return (
    <Card className="py-0">
      <div
        key={exercise.id}
        className="cursor-pointer transition-all duration-200"
        onClick={() => handleExerciseClick(exercise.id)}
      >
        {/* Exercise Image with Badges */}
        {exercise.images.length > 0 && (
          <div className="relative mb-4">
            <img
              src={'/exercises/' + exercise.images[0]}
              alt={exercise.name}
              className="w-full h-72 object-cover rounded-t-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Badges in top right corner */}
            <div className="absolute top-2 right-2 flex flex-row gap-1">
              {exercise.category && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                  {exercise.category}
                </span>
              )}
              {exercise.level && (
                <span
                  className={`text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm ${
                    exercise.level.toLowerCase() === 'beginner'
                      ? 'bg-green-500'
                      : exercise.level.toLowerCase() === 'intermediate'
                        ? 'bg-yellow-500'
                        : exercise.level.toLowerCase() === 'advanced'
                          ? 'bg-red-500'
                          : 'bg-gray-500'
                  }`}
                >
                  {exercise.level}
                </span>
              )}
            </div>
          </div>
        )}
        <div className="px-6 pb-2">
          {/* Exercise Name */}
          <h3 className="text-xl font-semibold mb-2">{exercise.name}</h3>

          <div className="space-y-2 text-sm text-gray-600">
            {exercise.primaryMuscles.length > 0 && exercise.equipment && (
              <p>
                {exercise.primaryMuscles.join(', ').charAt(0).toUpperCase() +
                  exercise.primaryMuscles.join(', ').slice(1)}{' '}
                / {exercise.equipment.charAt(0).toUpperCase() + exercise.equipment.slice(1)}
              </p>
            )}
          </div>

          {exercise.instructions && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 line-clamp-3">{exercise.instructions}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
