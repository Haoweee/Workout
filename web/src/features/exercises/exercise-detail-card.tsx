import { DumbbellIcon, UsersIcon, TargetIcon, ClockIcon } from '@/components/ui/icons';

import { Badge } from '@/components/ui/badge';

import type { ExerciseDetailCardProps } from '@/types/exercise';

export const ExerciseDetailCard: React.FC<ExerciseDetailCardProps> = ({ exercise }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Exercise Images */}
      {exercise.images.length > 0 && (
        <div className="relative">
          <img
            src={`/exercises/${exercise.images[0]}`}
            alt={exercise.name}
            className="w-full h-96 object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Badges overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {exercise.category && (
              <Badge variant="secondary" className="bg-blue-500 text-white">
                {exercise.category}
              </Badge>
            )}
            {exercise.level && (
              <Badge
                variant="secondary"
                className={`text-white ${
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
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Exercise Content */}
      <div className="p-8">
        {/* Title and Basic Info */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{exercise.name}</h1>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {exercise.equipment && (
              <div className="flex items-center space-x-2 text-gray-600">
                <DumbbellIcon className="h-5 w-5" />
                <div>
                  <p className="text-xs uppercase tracking-wide font-medium">Equipment</p>
                  <p className="font-semibold">{exercise.equipment}</p>
                </div>
              </div>
            )}

            {exercise.force && (
              <div className="flex items-center space-x-2 text-gray-600">
                <TargetIcon className="h-5 w-5" />
                <div>
                  <p className="text-xs uppercase tracking-wide font-medium">Force</p>
                  <p className="font-semibold capitalize">{exercise.force.toLowerCase()}</p>
                </div>
              </div>
            )}

            {exercise.mechanic && (
              <div className="flex items-center space-x-2 text-gray-600">
                <ClockIcon className="h-5 w-5" />
                <div>
                  <p className="text-xs uppercase tracking-wide font-medium">Mechanic</p>
                  <p className="font-semibold capitalize">{exercise.mechanic.toLowerCase()}</p>
                </div>
              </div>
            )}

            {exercise.level && (
              <div className="flex items-center space-x-2 text-gray-600">
                <UsersIcon className="h-5 w-5" />
                <div>
                  <p className="text-xs uppercase tracking-wide font-medium">Level</p>
                  <p className="font-semibold capitalize">{exercise.level.toLowerCase()}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Muscle Groups */}
        <div className="mb-8">
          {exercise.primaryMuscles.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Primary Muscle Groups</h3>
              <div className="flex flex-wrap gap-2">
                {exercise.primaryMuscles.map((muscle, index) => (
                  <Badge key={index} variant="default" className="capitalize">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {exercise.secondaryMuscles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secondary Muscle Groups</h3>
              <div className="flex flex-wrap gap-2">
                {exercise.secondaryMuscles.map((muscle, index) => (
                  <Badge key={index} variant="outline" className="capitalize">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        {exercise.instructions && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">How to Perform</h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {exercise.instructions}
              </p>
            </div>
          </div>
        )}

        {/* Additional Images */}
        {exercise.images.length > 1 && (
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Exercise Demonstration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exercise.images.slice(0, 2).map((image, index) => (
                <img
                  key={index}
                  src={`/exercises/${image}`}
                  alt={`${exercise.name} demonstration ${index + 2}`}
                  className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
