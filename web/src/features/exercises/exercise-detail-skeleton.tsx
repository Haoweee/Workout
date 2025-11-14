import { Skeleton } from '@/components/ui/skeleton';

import { ExerciseHeader } from './exercise-header';

type ExerciseDetailSkeletonProps = {
  handleBackClick: () => void;
};

export const ExerciseDetailSkeleton = ({ handleBackClick }: ExerciseDetailSkeletonProps) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <ExerciseHeader handleBackClick={handleBackClick} />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Image skeleton */}
        <Skeleton className="w-full h-96" />

        {/* Content skeleton */}
        <div className="p-8">
          {/* Title skeleton */}
          <div className="mb-8">
            <Skeleton className="h-12 w-3/4 mb-4" />

            {/* Info grid skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Skeleton className="h-5 w-5 rounded" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Muscle groups skeleton */}
          <div className="mb-8">
            <div className="mb-4">
              <Skeleton className="h-6 w-48 mb-2" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-6 w-16 rounded-full" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-6 w-56 mb-2" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton key={index} className="h-6 w-20 rounded-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Instructions skeleton */}
          <div className="mb-8">
            <Skeleton className="h-8 w-40 mb-4" />
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-4 w-full" />
                ))}
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>

          {/* Additional images skeleton */}
          <div>
            <Skeleton className="h-8 w-56 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton key={index} className="w-full h-64 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
