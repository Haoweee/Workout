import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const WorkoutDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <div>
              <Skeleton className="h-9 w-64 mb-2" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-10" />
          </div>
        </div>

        {/* Workout Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <div className="flex-1">
                    <Skeleton className="h-3 w-12 mb-1" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Optional Status Card (In Progress) */}
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <div>
                  <Skeleton className="h-5 w-40 mb-1" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
              <Skeleton className="h-10 w-20" />
            </div>
          </CardContent>
        </Card>

        {/* Exercises Card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-20" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Exercise 1 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-6 w-48" />
                </div>

                <div className="overflow-x-auto">
                  {/* Table Header */}
                  <div className="grid grid-cols-5 gap-4 pb-2 border-b border-gray-200">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-12" />
                  </div>

                  {/* Table Rows */}
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="grid grid-cols-5 gap-4 py-2 border-b border-gray-100">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Exercise 2 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-6 w-44" />
                </div>

                <div className="overflow-x-auto">
                  {/* Table Header */}
                  <div className="grid grid-cols-5 gap-4 pb-2 border-b border-gray-200">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-12" />
                  </div>

                  {/* Table Rows */}
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="grid grid-cols-5 gap-4 py-2 border-b border-gray-100">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Exercise 3 */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-6 w-52" />
                </div>

                <div className="overflow-x-auto">
                  {/* Table Header */}
                  <div className="grid grid-cols-5 gap-4 pb-2 border-b border-gray-200">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-12" />
                  </div>

                  {/* Table Rows */}
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="grid grid-cols-5 gap-4 py-2 border-b border-gray-100">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-14" />
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
