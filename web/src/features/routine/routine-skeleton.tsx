import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const RoutineSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-6">
          {/* Back button */}
          <Skeleton className="h-10 w-32 mb-4" />

          {/* Title and Author */}
          <div className="flex flex-row justify-between items-center mb-4">
            <Skeleton className="h-9 w-80" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          {/* Description */}
          <Skeleton className="h-4 w-96 mb-4" />

          {/* Badges */}
          <div className="flex gap-2 mb-6">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row justify-between items-center">
            <div className="flex gap-3">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-28" />
            </div>
            <Skeleton className="h-10 w-20" />
          </div>
        </div>

        {/* Exercises Card */}
        <Card>
          <CardContent className="pt-6 pb-4">
            <div className="space-y-8">
              {/* Day 1 */}
              <div className="mb-6">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-3">
                  {/* Table Header */}
                  <div className="grid grid-cols-4 gap-4 pb-2 border-b">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12 justify-self-end" />
                    <Skeleton className="h-4 w-12 justify-self-end" />
                    <Skeleton className="h-4 w-12 justify-self-end" />
                  </div>
                  {/* Table Rows */}
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4 py-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-5 w-8 justify-self-end" />
                      <Skeleton className="h-5 w-12 justify-self-end" />
                      <Skeleton className="h-5 w-8 justify-self-end" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Day 2 */}
              <div className="mb-6">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-3">
                  {/* Table Header */}
                  <div className="grid grid-cols-4 gap-4 pb-2 border-b">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12 justify-self-end" />
                    <Skeleton className="h-4 w-12 justify-self-end" />
                    <Skeleton className="h-4 w-12 justify-self-end" />
                  </div>
                  {/* Table Rows */}
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4 py-2">
                      <Skeleton className="h-5 w-36" />
                      <Skeleton className="h-5 w-8 justify-self-end" />
                      <Skeleton className="h-5 w-12 justify-self-end" />
                      <Skeleton className="h-5 w-8 justify-self-end" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Day 3 */}
              <div className="mb-6">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-3">
                  {/* Table Header */}
                  <div className="grid grid-cols-4 gap-4 pb-2 border-b">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12 justify-self-end" />
                    <Skeleton className="h-4 w-12 justify-self-end" />
                    <Skeleton className="h-4 w-12 justify-self-end" />
                  </div>
                  {/* Table Rows */}
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="grid grid-cols-4 gap-4 py-2">
                      <Skeleton className="h-5 w-44" />
                      <Skeleton className="h-5 w-8 justify-self-end" />
                      <Skeleton className="h-5 w-12 justify-self-end" />
                      <Skeleton className="h-5 w-8 justify-self-end" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
