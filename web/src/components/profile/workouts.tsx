import React, { useState, useEffect } from 'react';

import { TrendingUp } from 'lucide-react';

import { ChartLineDefault } from '@/components/charts/line';
import type { ChartConfig } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { TabsContent } from '@/components/ui/tabs';
import { WorkoutTable } from '@/components/charts/workouts-table';
import WorkoutCalendar from '@/components/charts/workout-calendar';

import { workoutService } from '@/services/workout.service';

import { useGetUserWorkouts } from '@/hooks/workouts/useGetUserWorkouts';
// import { ChartRadarDefault } from '@/components/charts/radar';
// import { ChartAreaGradient } from '@/components/charts/area';
// import { ChartBarDefault } from '@/components/charts/bar';

import type { ChartDataPoint } from '@/types/workout';

export const WorkoutsTab: React.FC = () => {
  const [overallProgress, setOverallProgress] = useState<ChartDataPoint[]>([]);
  // const [muscleGroups, setMuscleGroups] = useState<ChartDataPoint[]>([]);
  // const [volumeOverTime, setVolumeOverTime] = useState<ChartDataPoint[]>([]);

  const { workouts, isLoading: loading } = useGetUserWorkouts(5);

  useEffect(() => {
    // fetchWorkouts();
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [overallData] = await Promise.all([
        // const [overallData, muscleData, volumeData] = await Promise.all([
        workoutService.getWorkoutAnalytics('overall-progress', 6),
        // workoutService.getWorkoutAnalytics('muscle-groups', 6),
        // workoutService.getWorkoutAnalytics('volume-over-time', 6),
      ]);

      setOverallProgress(overallData);
      // setMuscleGroups(muscleData);
      // setVolumeOverTime(volumeData);

      // Debug logging
      // console.log('Analytics data received:', {
      // overallProgress: overallData,
      // muscleGroups: muscleData,
      // volumeOverTime: volumeData,
      // });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback to empty arrays on error
      setOverallProgress([]);
      // setMuscleGroups([]);
      // setVolumeOverTime([]);
    }
  };

  if (loading) {
    return (
      <TabsContent value="workouts" className="space-y-4">
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </div>
      </TabsContent>
    );
  }

  const chartConfig: ChartConfig = {
    desktop: {
      label: 'Workouts',
      color: 'var(--chart-1)',
    },
  };

  return (
    <TabsContent value="workouts" className="space-y-6">
      <div className="min-h-screen bg-gray-50 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:h-86">
          <div className="w-full lg:w-1/3 h-full">
            <div className="h-full flex flex-col">
              <div className="flex-1 h-full">
                <ChartLineDefault
                  header="Overall Progress"
                  headerIcon={TrendingUp}
                  headerDescription={
                    overallProgress.length > 0
                      ? `Past 6 weeks: ${overallProgress[0].month || 'Unknown'} - ${
                          overallProgress[overallProgress.length - 1].month || 'Unknown'
                        }`
                      : 'Overall Progress'
                  }
                  hasFooter={false}
                  chartData={overallProgress.map((item) => ({
                    month: item.month || 'Unknown',
                    desktop: item.desktop || 0,
                  }))}
                  chartConfig={chartConfig}
                  className="h-full"
                />
              </div>
            </div>
          </div>
          <div className="flex-1 h-full">
            <WorkoutTable conciseTable={true} data={workouts} />
          </div>
        </div>

        <div className="w-full">
          <WorkoutCalendar className="w-full" />
        </div>

        {/* <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <ChartRadarDefault
            header="Muscle Group Focus"
            headerIcon={TrendingUp}
            headerDescription="Volume-weighted muscle group distribution over the last 6 months"
            hasFooter={true}
            chartData={
              muscleGroups.length > 0
                ? muscleGroups.map(item => ({
                    month: item.muscleGroup || item.month || 'Unknown',
                    desktop: item.exercises || item.desktop || 0,
                  }))
                : []
            }
            chartConfig={chartConfig}
          />
          <ChartAreaGradient
            header="Recovery vs Performance"
            headerIcon={TrendingUp}
            headerDescription="Comparing recovery and performance over the last 6 months"
            hasFooter={true}
            chartData={[]} // Placeholder - skip recovery vs performance for now
            chartConfig={chartConfig}
          />
          <ChartBarDefault
            header="Volume Over Time"
            headerIcon={TrendingUp}
            headerDescription="Volume lifted in the last 6 months"
            hasFooter={true}
            chartData={volumeOverTime.map(item => ({
              month: item.month || 'Unknown',
              desktop: item.desktop || 0,
            }))}
            chartConfig={chartConfig}
          />
        </div> */}
      </div>
    </TabsContent>
  );
};
