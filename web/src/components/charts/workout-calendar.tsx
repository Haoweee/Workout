import React, { useState, useEffect } from 'react';
import ContributionCalendar, { type CellInfo } from './calendar';
import { workoutService, type Workout } from '@/services/workout.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, Calendar, TrendingUp } from 'lucide-react';

// Workout-themed color scale: from light blue to dark blue/purple
const WORKOUT_COLORS: [string, string, string, string, string] = [
  '#f1f5f9', // Very light blue-gray (no workouts)
  '#bfdbfe', // Light blue (1 workout)
  '#60a5fa', // Medium blue (2-3 workouts)
  '#3b82f6', // Blue (4-6 workouts)
  '#1d4ed8', // Dark blue (7+ workouts)
];

// Thresholds for workout intensity levels
const WORKOUT_THRESHOLDS: [number, number, number, number] = [1, 2, 4, 7];

interface WorkoutCalendarProps {
  className?: string;
  showStats?: boolean;
}

export default function WorkoutCalendar({
  className = '',
  showStats = true,
}: WorkoutCalendarProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCell, setSelectedCell] = useState<CellInfo | null>(null);

  useEffect(() => {
    fetchWorkoutData();
  }, []);

  const fetchWorkoutData = async () => {
    try {
      setLoading(true);

      // Calculate date range for the past year
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(endDate.getFullYear() - 1);

      // Fetch workouts for the past year
      const response = await workoutService.getUserWorkouts({
        limit: 365, // Get all workouts for the year
        offset: 0,
        includeFinished: true,
      });

      if (response && response.workouts && Array.isArray(response.workouts)) {
        setWorkouts(response.workouts);
      } else {
        console.warn('Unexpected API response structure:', response);
        setWorkouts([]);
      }
    } catch (error) {
      console.error('Error fetching workout data:', error);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  // Transform workout data into calendar format
  const calendarData = React.useMemo(() => {
    const workoutMap = new Map<string, number>();

    workouts.forEach((workout) => {
      if (workout.finishedAt) {
        // Only count completed workouts
        const date = new Date(workout.startedAt);
        const iso = date.toISOString().slice(0, 10);
        workoutMap.set(iso, (workoutMap.get(iso) || 0) + 1);
      }
    });

    return Array.from(workoutMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));
  }, [workouts]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const calculateCurrentStreak = () => {
      const today = new Date();
      let streak = 0;
      const currentDate = new Date(today);

      // Go backwards from today checking for workouts
      while (currentDate >= new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000)) {
        const iso = currentDate.toISOString().slice(0, 10);
        const hasWorkout = workouts.some(
          (w) => w.finishedAt && new Date(w.startedAt).toISOString().slice(0, 10) === iso
        );

        if (hasWorkout) {
          streak++;
        } else if (streak > 0) {
          break; // Streak is broken
        }

        currentDate.setDate(currentDate.getDate() - 1);
      }

      return streak;
    };

    const calculateLongestStreak = () => {
      // Sort workout dates
      const workoutDates = workouts
        .filter((w) => w.finishedAt)
        .map((w) => new Date(w.startedAt).toISOString().slice(0, 10))
        .sort();

      if (workoutDates.length === 0) return 0;

      let maxStreak = 1;
      let currentStreak = 1;

      for (let i = 1; i < workoutDates.length; i++) {
        const prevDate = new Date(workoutDates[i - 1]);
        const currDate = new Date(workoutDates[i]);
        const dayDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

        if (dayDiff === 1) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 1;
        }
      }

      return maxStreak;
    };

    const getThisMonthWorkouts = () => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      return workouts.filter((w) => w.finishedAt && new Date(w.startedAt) >= startOfMonth).length;
    };

    const totalWorkouts = workouts.filter((w) => w.finishedAt).length;
    const currentStreak = calculateCurrentStreak();
    const longestStreak = calculateLongestStreak();
    const thisMonthWorkouts = getThisMonthWorkouts();

    return {
      totalWorkouts,
      currentStreak,
      longestStreak,
      thisMonthWorkouts,
    };
  }, [workouts]);

  const handleCellClick = (cell: CellInfo) => {
    setSelectedCell(cell);
  };

  const customTooltip = (cell: CellInfo) => {
    const date = new Date(cell.date);
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    if (cell.count === 0) {
      return `No workouts on ${dateStr}`;
    } else if (cell.count === 1) {
      return `1 workout on ${dateStr}`;
    } else {
      return `${cell.count} workouts on ${dateStr}`;
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-red-600" />
            Workout Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
          {showStats && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-red-600" />
          Workout Activity
        </CardTitle>
        <p className="text-sm text-gray-600">Track your workout consistency over the past year</p>
      </CardHeader>
      <CardContent className="w-full">
        <div className="w-full flex flex-col lg:flex-row items-center gap-8">
          <div className="w-full lg:w-1/3 lg:shrink-0">
            {showStats && (
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-xs text-gray-600">Total</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{stats.totalWorkouts}</div>
                  <div className="text-xs text-gray-500">Workouts</div>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-gray-600">Current</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{stats.currentStreak}</div>
                  <div className="text-xs text-gray-500">Day streak</div>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="h-4 w-4 text-orange-600" />
                    <span className="text-xs text-gray-600">Longest</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{stats.longestStreak}</div>
                  <div className="text-xs text-gray-500">Day streak</div>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-xs text-gray-600">This Month</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">{stats.thisMonthWorkouts}</div>
                  <div className="text-xs text-gray-500">Workouts</div>
                </div>
              </div>
            )}
          </div>

          <div className="w-full min-w-0">
            {/* Calendar container with horizontal scroll on small screens */}
            <div className="overflow-x-auto">
              <div className="w-full ml-auto">
                <ContributionCalendar
                  data={calendarData}
                  colorScale={WORKOUT_COLORS}
                  thresholds={WORKOUT_THRESHOLDS}
                  onCellClick={handleCellClick}
                  tooltip={customTooltip}
                  className="mb-4 w-full"
                />
              </div>
            </div>

            {selectedCell && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">{customTooltip(selectedCell)}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
