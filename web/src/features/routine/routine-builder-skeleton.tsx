import React from 'react';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const RoutineBuilderSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Page Title */}
        <Skeleton className="h-9 w-64 mb-6" />

        <form className="space-y-6">
          {/* Basic Information Card */}
          <Card className="p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Skeleton className="h-4 w-36 mb-2" />
              <Skeleton className="h-20 w-full" />
            </div>
          </Card>

          {/* Exercise Builder Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-9 w-28" />
            </div>

            {/* Day Tabs */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            </div>

            {/* Exercise Search */}
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="absolute right-1 top-1 h-8 w-12" />
                </div>
              </div>

              {/* Popular Exercises Quick Add */}
              <div className="flex flex-wrap gap-2">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-24" />
                ))}
              </div>
            </div>

            {/* Current Day Exercises */}
            <div>
              <Skeleton className="h-5 w-40 mb-3" />

              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Skeleton className="h-5 w-44" />
                        </div>
                      </div>

                      {/* Inline Exercise Configuration */}
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          <Skeleton className="h-3 w-8 mb-1" />
                          <Skeleton className="h-8 w-16" />
                        </div>

                        <Skeleton className="h-4 w-2" />

                        <div className="flex flex-col items-center">
                          <Skeleton className="h-3 w-10 mb-1" />
                          <Skeleton className="h-8 w-20" />
                        </div>

                        <div className="flex flex-col items-center">
                          <Skeleton className="h-3 w-16 mb-1" />
                          <div className="flex items-center gap-1">
                            <Skeleton className="h-8 w-16" />
                            <div className="flex flex-col gap-1">
                              {[30, 60, 90, 120, 180].map((_, j) => (
                                <Skeleton key={j} className="h-6 w-8" />
                              ))}
                            </div>
                          </div>
                        </div>

                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>

          {/* Submit Section */}
          <div className="flex gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-20" />
          </div>
        </form>
      </div>
    </div>
  );
};

// Template Selection Skeleton (for create mode)
export const TemplateSelectionSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <Skeleton className="h-9 w-64 mb-6" />

        {/* Quick Start Templates */}
        <div className="mb-8">
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-3 w-32" />
              </Card>
            ))}

            {/* Start from scratch card */}
            <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-dashed border-2">
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Skeleton className="h-8 w-8 mb-2" />
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-28" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
