import {
  PrismaClient,
  Workout,
  WorkoutSet,
  Visibility,
  ExerciseType,
  Difficulty,
} from '@prisma/client';
import { CreateWorkoutInput } from '@/types';
import { logger } from '@utils/logger';

export interface UpdateWorkoutInput {
  title?: string;
  visibility?: Visibility;
  finishedAt?: Date | null;
}

export interface CreateWorkoutSetInput {
  exerciseId?: number;
  customExerciseName?: string;
  customExerciseCategory?: string;
  customExercisePrimaryMuscles?: string[];
  setNumber?: number;
  reps?: number;
  weightKg?: number;
  rpe?: number;
  durationSec?: number;
  notes?: string;
}

export interface UpdateWorkoutSetInput {
  reps?: number;
  weightKg?: number;
  rpe?: number;
  durationSec?: number;
  notes?: string;
}

export interface WorkoutWithDetails extends Workout {
  // workoutSets: (WorkoutSet & {
  //   exercise?: {
  //     id: number;
  //     name: string;
  //     category: string | null;
  //     primaryMuscles: string[];
  //     secondaryMuscles: string[];
  //   } | null;
  // })[];
  routine?: {
    id: string;
    title: string;
  } | null;
}

const prisma = new PrismaClient();

export class WorkoutService {
  /**
   * Create a new workout
   */
  static async createWorkout(
    userId: string,
    input: CreateWorkoutInput
  ): Promise<WorkoutWithDetails> {
    try {
      // If creating from a routine, validate routine exists and user has access
      let routineExercises: Array<{
        id: string;
        routineId: string;
        exerciseId: number | null;
        customExerciseName: string | null;
        dayIndex: number;
        orderIndex: number;
        sets: string | null;
        reps: string | null;
        restSeconds: number | null;
        notes: string | null;
        exercise: {
          id: number;
          name: string;
          equipment: string | null;
          category: ExerciseType | null;
          primaryMuscles: string[];
          secondaryMuscles: string[];
          level: Difficulty | null;
          force: string | null;
          mechanic: string | null;
          images: string[];
          instructions: string | null;
          exerciseId: string;
        } | null;
      }> = [];
      if (input.routineId) {
        const routine = await prisma.routine.findFirst({
          where: {
            id: input.routineId,
            OR: [{ authorId: userId }, { visibility: 'PUBLIC' }, { visibility: 'UNLISTED' }],
          },
          include: {
            routineExercises: {
              where: input.dayIndex !== undefined ? { dayIndex: input.dayIndex } : {},
              include: {
                exercise: true,
              },
              orderBy: { orderIndex: 'asc' },
            },
          },
        });

        if (!routine) {
          throw new Error('Routine not found or access denied');
        }

        routineExercises = routine.routineExercises;
      }

      const workout = await prisma.workout.create({
        data: {
          userId,
          routineId: input.routineId || null,
          title: input.title || null,
          visibility: input.visibility || 'PRIVATE',
        },
        include: {
          workoutSets: {
            include: {
              exercise: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                  primaryMuscles: true,
                  secondaryMuscles: true,
                },
              },
            },
            orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }],
          },
          routine: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      // If we have routine exercises, create placeholder workout sets
      if (routineExercises.length > 0) {
        for (const routineExercise of routineExercises) {
          // Create placeholder sets based on the routine's sets configuration
          const numberOfSets = routineExercise.sets ? parseInt(routineExercise.sets) : 3;

          for (let setNumber = 1; setNumber <= numberOfSets; setNumber++) {
            // Create workout set for either database exercise or custom exercise
            if (routineExercise.exercise) {
              // Database exercise
              await prisma.workoutSet.create({
                data: {
                  workoutId: workout.id,
                  exerciseId: routineExercise.exercise.id,
                  setNumber,
                  // Leave reps, weight, etc. null for user to fill in
                  notes: routineExercise.notes || null,
                },
              });
            } else if (routineExercise.customExerciseName) {
              // Custom exercise
              await prisma.workoutSet.create({
                data: {
                  workoutId: workout.id,
                  exerciseId: null, // No database exercise
                  customExerciseName: routineExercise.customExerciseName,
                  customExerciseCategory: null, // We could add this field to RoutineExercise if needed
                  customExercisePrimaryMuscles: [], // We could add this field to RoutineExercise if needed
                  setNumber,
                  // Leave reps, weight, etc. null for user to fill in
                  notes: routineExercise.notes || null,
                },
              });
            }
          }
        }

        // Refetch the workout with the created sets
        const updatedWorkout = await prisma.workout.findUnique({
          where: { id: workout.id },
          include: {
            workoutSets: {
              include: {
                exercise: {
                  select: {
                    id: true,
                    name: true,
                    category: true,
                    primaryMuscles: true,
                    secondaryMuscles: true,
                  },
                },
              },
              orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }],
            },
            routine: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        });

        if (updatedWorkout) {
          logger.info(
            `Created workout ${updatedWorkout.id} for user ${userId} with ${routineExercises.length} exercises from routine`
          );
          return updatedWorkout;
        }
      }

      logger.info(`Created workout ${workout.id} for user ${userId}`);
      return workout;
    } catch (error) {
      logger.error('Error creating workout:', error);
      throw error;
    }
  }

  /**
   * Get user's workouts with optional filtering
   */
  static async getUserWorkouts(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      includeFinished?: boolean;
      routineId?: string;
    } = {}
  ): Promise<{ workouts: WorkoutWithDetails[]; total: number }> {
    try {
      const { limit = 20, offset = 0, includeFinished = true, routineId } = options;

      const where = {
        userId,
        ...(!includeFinished && { finishedAt: null }),
        ...(routineId && { routineId }),
      };

      const [workouts, total] = await Promise.all([
        prisma.workout.findMany({
          where,
          include: {
            // workoutSets: {
            //   include: {
            //     exercise: {
            //       select: {
            //         id: true,
            //         name: true,
            //         category: true,
            //         primaryMuscles: true,
            //         secondaryMuscles: true,
            //       },
            //     },
            //   },
            //   orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }],
            // },
            routine: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: { startedAt: 'desc' },
          take: limit,
          skip: offset,
        }),
        prisma.workout.count({ where }),
      ]);

      return { workouts, total };
    } catch (error) {
      logger.error('Error fetching user workouts:', error);
      throw error;
    }
  }

  /**
   * Get workout by ID (with access control)
   */
  static async getWorkoutById(
    workoutId: string,
    userId?: string
  ): Promise<WorkoutWithDetails | null> {
    try {
      logger.info(`Service: Fetching workout ${workoutId} for user ${userId}`);

      const workout = await prisma.workout.findUnique({
        where: { id: workoutId },
        include: {
          workoutSets: {
            select: {
              id: true,
              exerciseId: true,
              customExerciseName: true,
              setNumber: true,
              reps: true,
              weightKg: true,
              rpe: true,
              notes: true,
              exercise: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }],
          },
          routine: {
            select: {
              id: true,
              title: true,
              routineExercises: {
                select: {
                  exerciseId: true,
                  customExerciseName: true,
                  orderIndex: true,
                  dayIndex: true,
                },
                orderBy: [{ dayIndex: 'asc' }, { orderIndex: 'asc' }],
              },
            },
          },
        },
      });

      if (!workout) {
        logger.warn(`Service: Workout ${workoutId} not found in database`);
        return null;
      }

      // Check access permissions
      if (workout.userId !== userId && workout.visibility === 'PRIVATE') {
        logger.warn(
          `Service: Access denied to workout ${workoutId} for user ${userId} (owner: ${workout.userId})`
        );
        return null;
      }

      // Create a map of exercise order from routine exercises
      const exerciseOrderMap = new Map<string, number>();
      if (workout.routine?.routineExercises) {
        workout.routine.routineExercises.forEach((re) => {
          const key = re.exerciseId ? `db_${re.exerciseId}` : `custom_${re.customExerciseName}`;
          exerciseOrderMap.set(key, re.orderIndex);
        });
      }

      // Transform the data to group sets by exercise
      interface ExerciseGroup {
        exerciseId: number | null;
        exerciseName: string;
        isCustom: boolean;
        orderIndex: number;
        sets: Array<{
          setNumber: number;
          reps: number | null;
          weightKg: number | null;
          rpe: number | null;
          notes: string | null;
          completed: boolean;
        }>;
      }

      const exerciseGroups = workout.workoutSets.reduce(
        (acc, set) => {
          const exerciseName = set.exercise?.name || set.customExerciseName || 'Unknown';
          const exerciseKey = set.exerciseId ? `db_${set.exerciseId}` : `custom_${exerciseName}`;

          if (!acc[exerciseKey]) {
            const orderIndex = exerciseOrderMap.get(exerciseKey) ?? 999; // Default to end if not found
            acc[exerciseKey] = {
              exerciseId: set.exerciseId,
              exerciseName,
              isCustom: !set.exerciseId,
              orderIndex: orderIndex,
              sets: [],
            };
          }

          // TypeScript needs explicit assertion after the check above
          acc[exerciseKey].sets.push({
            setNumber: set.setNumber,
            reps: set.reps,
            weightKg: set.weightKg ? Number(set.weightKg) : null,
            rpe: set.rpe ? Number(set.rpe) : null,
            notes: set.notes,
            completed: set.reps !== null || set.weightKg !== null || set.rpe !== null,
          });

          return acc;
        },
        {} as Record<string, ExerciseGroup>
      );

      // Convert to array and sort by orderIndex
      const sortedExercises = Object.values(exerciseGroups).sort(
        (a, b) => a.orderIndex - b.orderIndex
      );

      // Transform to clean format
      const transformedWorkout = {
        id: workout.id,
        userId: workout.userId,
        routineId: workout.routineId,
        title: workout.title,
        visibility: workout.visibility,
        startedAt: workout.startedAt,
        finishedAt: workout.finishedAt,
        routine: workout.routine
          ? {
              id: workout.routine.id,
              title: workout.routine.title,
            }
          : null,
        exercises: sortedExercises,
      };

      logger.info(`Service: Successfully returning workout ${workoutId} to user ${userId}`);
      return transformedWorkout;
    } catch (error) {
      logger.error('Error fetching workout:', error);
      throw error;
    }
  }

  /**
   * Update workout
   */
  static async updateWorkout(
    workoutId: string,
    userId: string,
    input: UpdateWorkoutInput
  ): Promise<WorkoutWithDetails> {
    try {
      // Check ownership
      const existingWorkout = await prisma.workout.findUnique({
        where: { id: workoutId },
        select: { userId: true },
      });

      if (!existingWorkout || existingWorkout.userId !== userId) {
        throw new Error('Workout not found or access denied');
      }

      const workout = await prisma.workout.update({
        where: { id: workoutId },
        data: input,
        include: {
          workoutSets: {
            include: {
              exercise: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                  primaryMuscles: true,
                  secondaryMuscles: true,
                },
              },
            },
            orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }],
          },
          routine: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      logger.info(`Updated workout ${workoutId} for user ${userId}`);
      return workout;
    } catch (error) {
      logger.error('Error updating workout:', error);
      throw error;
    }
  }

  /**
   * Delete workout
   */
  static async deleteWorkout(workoutId: string, userId: string): Promise<void> {
    try {
      // Check ownership
      const existingWorkout = await prisma.workout.findUnique({
        where: { id: workoutId },
        select: { userId: true },
      });

      if (!existingWorkout || existingWorkout.userId !== userId) {
        throw new Error('Workout not found or access denied');
      }

      await prisma.$transaction(async (tx) => {
        // Delete workout sets first
        await tx.workoutSet.deleteMany({
          where: { workoutId },
        });

        // Delete workout
        await tx.workout.delete({
          where: { id: workoutId },
        });
      });

      logger.info(`Deleted workout ${workoutId} for user ${userId}`);
    } catch (error) {
      logger.error('Error deleting workout:', error);
      throw error;
    }
  }

  /**
   * Add workout set
   */
  static async addWorkoutSet(
    workoutId: string,
    userId: string,
    input: CreateWorkoutSetInput
  ): Promise<
    WorkoutSet & {
      exercise?: {
        id: number;
        name: string;
        category: string | null;
        primaryMuscles: string[];
        secondaryMuscles: string[];
      } | null;
    }
  > {
    try {
      logger.debug('addWorkoutSet called', { workoutId, userId, input });

      // Check workout ownership
      const workout = await prisma.workout.findUnique({
        where: { id: workoutId },
        select: { userId: true },
      });

      if (!workout || workout.userId !== userId) {
        throw new Error('Workout not found or access denied');
      }

      // Validate that either exerciseId OR custom exercise data is provided
      const hasExerciseId = input.exerciseId !== undefined;
      const hasCustomExercise = input.customExerciseName !== undefined;

      logger.debug('Validation check', {
        hasExerciseId,
        hasCustomExercise,
        exerciseId: input.exerciseId,
        customExerciseName: input.customExerciseName,
      });

      if (!hasExerciseId && !hasCustomExercise) {
        logger.error('Validation failed: Neither exerciseId nor customExerciseName provided');
        throw new Error('Either exerciseId or customExerciseName must be provided');
      }

      if (hasExerciseId && hasCustomExercise) {
        throw new Error('Cannot provide both exerciseId and customExerciseName');
      }

      let exercise = null;

      // Validate exercise exists if exerciseId provided
      if (hasExerciseId) {
        exercise = await prisma.exercise.findUnique({
          where: { id: input.exerciseId! },
        });

        if (!exercise) {
          throw new Error('Exercise not found');
        }
      }

      // Auto-increment set number if not provided
      let setNumber = input.setNumber;
      if (!setNumber) {
        const whereClause = hasExerciseId
          ? { workoutId, exerciseId: input.exerciseId! }
          : { workoutId, customExerciseName: input.customExerciseName! };

        const lastSet = await prisma.workoutSet.findFirst({
          where: whereClause,
          orderBy: { setNumber: 'desc' },
        });
        setNumber = (lastSet?.setNumber || 0) + 1;
      }

      const baseCreateData = {
        workoutId,
        setNumber,
        ...(input.reps !== undefined && { reps: input.reps }),
        ...(input.weightKg !== undefined && { weightKg: input.weightKg }),
        ...(input.rpe !== undefined && { rpe: input.rpe }),
        ...(input.durationSec !== undefined && { durationSec: input.durationSec }),
        ...(input.notes !== undefined && { notes: input.notes }),
      };

      const createData = hasExerciseId
        ? {
            ...baseCreateData,
            exerciseId: input.exerciseId!,
          }
        : {
            ...baseCreateData,
            customExerciseName: input.customExerciseName!,
            ...(input.customExerciseCategory !== undefined && {
              customExerciseCategory: input.customExerciseCategory,
            }),
            ...(input.customExercisePrimaryMuscles !== undefined && {
              customExercisePrimaryMuscles: input.customExercisePrimaryMuscles,
            }),
          };

      const workoutSet = await prisma.workoutSet.create({
        data: createData,
        include: {
          exercise: hasExerciseId
            ? {
                select: {
                  id: true,
                  name: true,
                  category: true,
                  primaryMuscles: true,
                  secondaryMuscles: true,
                },
              }
            : false,
        },
      });

      logger.info(`Added workout set ${workoutSet.id} to workout ${workoutId}`);
      return workoutSet;
    } catch (error) {
      logger.error('Error adding workout set:', error);
      throw error;
    }
  }

  /**
   * Update workout set
   */
  static async updateWorkoutSet(
    setId: string,
    userId: string,
    input: UpdateWorkoutSetInput
  ): Promise<
    WorkoutSet & {
      exercise?: {
        id: number;
        name: string;
        category: string | null;
        primaryMuscles: string[];
        secondaryMuscles: string[];
      } | null;
    }
  > {
    try {
      // Check workout ownership through workout set
      const existingSet = await prisma.workoutSet.findUnique({
        where: { id: setId },
        include: {
          workout: {
            select: { userId: true },
          },
        },
      });

      if (!existingSet || existingSet.workout.userId !== userId) {
        throw new Error('Workout set not found or access denied');
      }

      const updateData = {
        ...(input.reps !== undefined && { reps: input.reps }),
        ...(input.weightKg !== undefined && { weightKg: input.weightKg }),
        ...(input.rpe !== undefined && { rpe: input.rpe }),
        ...(input.durationSec !== undefined && { durationSec: input.durationSec }),
        ...(input.notes !== undefined && { notes: input.notes }),
      };

      const workoutSet = await prisma.workoutSet.update({
        where: { id: setId },
        data: updateData,
        include: {
          exercise: {
            select: {
              id: true,
              name: true,
              category: true,
              primaryMuscles: true,
              secondaryMuscles: true,
            },
          },
        },
      });

      logger.info(`Updated workout set ${setId} for user ${userId}`);
      return workoutSet;
    } catch (error) {
      logger.error('Error updating workout set:', error);
      throw error;
    }
  }

  /**
   * Delete workout set
   */
  static async deleteWorkoutSet(setId: string, userId: string): Promise<void> {
    try {
      // Check workout ownership through workout set
      const existingSet = await prisma.workoutSet.findUnique({
        where: { id: setId },
        include: {
          workout: {
            select: { userId: true },
          },
        },
      });

      if (!existingSet || existingSet.workout.userId !== userId) {
        throw new Error('Workout set not found or access denied');
      }

      await prisma.workoutSet.delete({
        where: { id: setId },
      });

      logger.info(`Deleted workout set ${setId} for user ${userId}`);
    } catch (error) {
      logger.error('Error deleting workout set:', error);
      throw error;
    }
  }

  /**
   * Delete workout set by exercise and set number
   */
  static async deleteWorkoutSetByExercise(
    workoutId: string,
    userId: string,
    params: {
      exerciseId: number | null;
      customExerciseName: string | null;
      setNumber: number;
    }
  ): Promise<void> {
    try {
      // First verify workout ownership
      const workout = await prisma.workout.findUnique({
        where: { id: workoutId },
        select: { userId: true },
      });

      if (!workout || workout.userId !== userId) {
        throw new Error('Workout not found or access denied');
      }

      // Find the specific set
      const whereClause = {
        workoutId,
        setNumber: params.setNumber,
        ...(params.exerciseId
          ? { exerciseId: params.exerciseId }
          : { customExerciseName: params.customExerciseName }),
      };

      const setToDelete = await prisma.workoutSet.findFirst({
        where: whereClause,
      });

      if (!setToDelete) {
        throw new Error('Workout set not found');
      }

      // Check if this is the last set for this exercise
      const totalSetsForExercise = await prisma.workoutSet.count({
        where: {
          workoutId,
          ...(params.exerciseId
            ? { exerciseId: params.exerciseId }
            : { customExerciseName: params.customExerciseName }),
        },
      });

      if (totalSetsForExercise <= 1) {
        throw new Error('Cannot delete the last set of an exercise');
      }

      // Delete the set
      await prisma.workoutSet.delete({
        where: { id: setToDelete.id },
      });

      logger.info(
        `Deleted workout set by exercise for user ${userId}: workout ${workoutId}, setNumber ${params.setNumber}`
      );
    } catch (error) {
      logger.error('Error deleting workout set by exercise:', error);
      throw error;
    }
  }

  /**
   * Finish workout (set finishedAt timestamp)
   */
  static async finishWorkout(workoutId: string, userId: string): Promise<WorkoutWithDetails> {
    try {
      const workout = await this.updateWorkout(workoutId, userId, {
        finishedAt: new Date(),
      });

      logger.info(`Finished workout ${workoutId} for user ${userId}`);
      return workout;
    } catch (error) {
      logger.error('Error finishing workout:', error);
      throw error;
    }
  }

  /**
   * Get workout statistics for a user
   */
  static async getWorkoutStats(userId: string): Promise<{
    totalWorkouts: number;
    totalSets: number;
    totalVolume: number; // Total weight lifted
    averageWorkoutDuration: number; // In minutes
    workoutsThisWeek: number;
    workoutsThisMonth: number;
  }> {
    try {
      const now = new Date();
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const [
        totalWorkouts,
        totalSets,
        volumeData,
        workoutsThisWeek,
        workoutsThisMonth,
        finishedWorkouts,
      ] = await Promise.all([
        prisma.workout.count({ where: { userId } }),
        prisma.workoutSet.count({
          where: { workout: { userId } },
        }),
        prisma.workoutSet.aggregate({
          where: {
            workout: { userId },
            weightKg: { not: null },
            reps: { not: null },
          },
          _sum: {
            weightKg: true,
          },
        }),
        prisma.workout.count({
          where: {
            userId,
            startedAt: { gte: weekStart },
          },
        }),
        prisma.workout.count({
          where: {
            userId,
            startedAt: { gte: monthStart },
          },
        }),
        prisma.workout.findMany({
          where: {
            userId,
            finishedAt: { not: null },
          },
          select: {
            startedAt: true,
            finishedAt: true,
          },
        }),
      ]);

      // Calculate average workout duration
      let totalDuration = 0;
      finishedWorkouts.forEach((workout) => {
        if (workout.finishedAt) {
          totalDuration += workout.finishedAt.getTime() - workout.startedAt.getTime();
        }
      });

      const averageWorkoutDuration =
        finishedWorkouts.length > 0
          ? Math.round(totalDuration / finishedWorkouts.length / (1000 * 60)) // Convert to minutes
          : 0;

      return {
        totalWorkouts,
        totalSets,
        totalVolume: Number(volumeData._sum.weightKg || 0),
        averageWorkoutDuration,
        workoutsThisWeek,
        workoutsThisMonth,
      };
    } catch (error) {
      logger.error('Error getting workout stats:', error);
      throw error;
    }
  }

  /**
   * Get overall progress analytics (workouts per month)
   */
  static async getOverallProgressAnalytics(
    userId: string,
    weeks: number = 6
  ): Promise<Array<{ month: string; desktop: number }>> {
    try {
      // For the past N weeks
      const now = new Date();
      const startDate = new Date();
      startDate.setDate(now.getDate() - weeks * 7); // N weeks * 7 days

      const workoutCounts = await prisma.workout.groupBy({
        by: ['startedAt'],
        where: {
          userId,
          startedAt: { gte: startDate },
          finishedAt: { not: null }, // Only count finished workouts
        },
        _count: {
          id: true,
        },
      });

      // Create weekly buckets with short labels
      const weeklyData: { [key: string]: number } = {};

      for (let i = 0; i < weeks; i++) {
        // Calculate the start of each week (weeks ago up to now)
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - (weeks - 1 - i) * 7);
        weekStart.setHours(0, 0, 0, 0);

        // Create MM/DD format label for graph
        const weekKey = `${(weekStart.getMonth() + 1).toString().padStart(2, '0')}/${weekStart.getDate().toString().padStart(2, '0')}`;
        weeklyData[weekKey] = 0;
      }

      // Helper function to get week start for a given date
      const getWeekStart = (date: Date): Date => {
        const weekStart = new Date(date);
        weekStart.setHours(0, 0, 0, 0);
        weekStart.setDate(date.getDate() - date.getDay()); // Go to Sunday of that week
        return weekStart;
      };

      // Count workouts per week
      workoutCounts.forEach((workout) => {
        const workoutWeekStart = getWeekStart(workout.startedAt);

        // Find which week bucket this workout belongs to
        for (let i = 0; i < weeks; i++) {
          const bucketWeekStart = new Date(now);
          bucketWeekStart.setDate(now.getDate() - (weeks - 1 - i) * 7);
          bucketWeekStart.setHours(0, 0, 0, 0);
          bucketWeekStart.setDate(bucketWeekStart.getDate() - bucketWeekStart.getDay());

          const nextWeekStart = new Date(bucketWeekStart);
          nextWeekStart.setDate(bucketWeekStart.getDate() + 7);

          if (workoutWeekStart >= bucketWeekStart && workoutWeekStart < nextWeekStart) {
            const weekKey = `${(bucketWeekStart.getMonth() + 1).toString().padStart(2, '0')}/${bucketWeekStart.getDate().toString().padStart(2, '0')}`;
            weeklyData[weekKey] = (weeklyData[weekKey] || 0) + workout._count.id;
            break;
          }
        }
      });

      // Convert to chart format
      return Object.entries(weeklyData)
        .map(([month, count]) => ({ month, desktop: count }))
        .sort((a, b) => {
          const [aMonth, aDay] = a.month.split('/').map(Number);
          const [bMonth, bDay] = b.month.split('/').map(Number);
          const aDate = new Date(
            now.getFullYear(),
            (typeof aMonth === 'number' && !isNaN(aMonth) ? aMonth : 1) - 1,
            typeof aDay === 'number' && !isNaN(aDay) ? aDay : 1
          );
          const bDate = new Date(
            now.getFullYear(),
            (typeof bMonth === 'number' && !isNaN(bMonth) ? bMonth : 1) - 1,
            typeof bDay === 'number' && !isNaN(bDay) ? bDay : 1
          );
          return aDate.getTime() - bDate.getTime();
        });
    } catch (error) {
      logger.error('Error getting overall progress analytics:', error);
      throw error;
    }
  }

  /**
   * Get muscle group analytics - shows volume-weighted muscle group focus
   */
  static async getMuscleGroupAnalytics(
    userId: string,
    months: number = 6
  ): Promise<Array<{ muscleGroup: string; exercises: number }>> {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      logger.info(
        `Fetching muscle group analytics for user ${userId} from ${startDate.toISOString()}`
      );

      // Get all workout sets performed by the user in the time period
      const workoutSets = await prisma.workoutSet.findMany({
        where: {
          workout: {
            userId,
            startedAt: {
              gte: startDate,
            },
          },
        },
        include: {
          exercise: {
            select: {
              id: true,
              name: true,
              primaryMuscles: true,
              secondaryMuscles: true,
            },
          },
        },
      });

      logger.info(`Found ${workoutSets.length} workout sets for muscle group analysis`);

      // Calculate volume-weighted scores per muscle group
      const muscleGroupScores: Record<string, number> = {};

      workoutSets.forEach((set) => {
        const exercise = set.exercise;

        // Calculate volume for this set (sets × reps × weight)
        // Note: setNumber represents the set number, not the count of sets
        // Each WorkoutSet record represents one set, so we use 1 as the set count
        const reps = set.reps || 0;
        const weight = Number(set.weightKg || 0);
        const volume = 1 * reps * weight; // 1 set × reps × weight

        logger.debug(`Set volume calculation: 1 set × ${reps} reps × ${weight}kg = ${volume}`);

        // Handle database exercises
        if (exercise) {
          // Apply volume to primary muscles (full weight = 1.0)
          if (exercise.primaryMuscles && Array.isArray(exercise.primaryMuscles)) {
            exercise.primaryMuscles.forEach((muscle: string) => {
              const muscleGroup = this.mapMuscleToGroup(muscle);
              const weightedVolume = volume * 1.0; // Primary muscle gets full weight
              muscleGroupScores[muscleGroup] =
                (muscleGroupScores[muscleGroup] || 0) + weightedVolume;
              logger.debug(
                `Exercise: ${exercise.name}, Primary muscle: ${muscle} -> ${muscleGroup}, volume: ${weightedVolume}, total: ${muscleGroupScores[muscleGroup]}`
              );
            });
          }

          // Apply volume to secondary muscles (half weight = 0.5)
          if (exercise.secondaryMuscles && Array.isArray(exercise.secondaryMuscles)) {
            exercise.secondaryMuscles.forEach((muscle: string) => {
              const muscleGroup = this.mapMuscleToGroup(muscle);
              const weightedVolume = volume * 0.5; // Secondary muscle gets half weight
              muscleGroupScores[muscleGroup] =
                (muscleGroupScores[muscleGroup] || 0) + weightedVolume;
              logger.debug(
                `Exercise: ${exercise.name}, Secondary muscle: ${muscle} -> ${muscleGroup}, volume: ${weightedVolume}, total: ${muscleGroupScores[muscleGroup]}`
              );
            });
          }
        } else if (set.customExerciseName && set.customExercisePrimaryMuscles) {
          // Handle custom exercises
          set.customExercisePrimaryMuscles.forEach((muscle: string) => {
            const muscleGroup = this.mapMuscleToGroup(muscle);
            const weightedVolume = volume * 1.0; // Primary muscle gets full weight
            muscleGroupScores[muscleGroup] = (muscleGroupScores[muscleGroup] || 0) + weightedVolume;
            logger.debug(
              `Custom Exercise: ${set.customExerciseName}, Primary muscle: ${muscle} -> ${muscleGroup}, volume: ${weightedVolume}, total: ${muscleGroupScores[muscleGroup]}`
            );
          });
        }
      });

      logger.info(`Muscle group volume scores:`, muscleGroupScores);

      // Define consistent order for muscle groups
      const allMuscleGroups = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'];

      // Create chart data in consistent order
      const chartData = allMuscleGroups.map((group) => ({
        muscleGroup: group,
        exercises: Math.round(muscleGroupScores[group] || 0), // Round to nearest whole number for display
      }));

      logger.info(`Final muscle group chart data:`, chartData);

      return chartData;
    } catch (error) {
      logger.error('Error getting muscle group analytics:', error);
      throw error;
    }
  }

  /**
   * Get volume over time analytics
   */
  static async getVolumeOverTimeAnalytics(
    userId: string,
    months: number = 6
  ): Promise<Array<{ month: string; desktop: number }>> {
    try {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

      const volumeData = await prisma.workoutSet.findMany({
        where: {
          workout: {
            userId,
            startedAt: { gte: startDate },
            finishedAt: { not: null },
          },
          weightKg: { not: null },
          reps: { not: null },
        },
        select: {
          weightKg: true,
          reps: true,
          workout: {
            select: {
              startedAt: true,
            },
          },
        },
      });

      // Create monthly buckets
      const monthlyVolume: { [key: string]: number } = {};

      for (let i = 0; i < months; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString('en-US', { month: 'long' });
        monthlyVolume[monthKey] = 0;
      }

      // Calculate volume per month (weight * reps)
      volumeData.forEach((set) => {
        const month = set.workout.startedAt.toLocaleDateString('en-US', { month: 'long' });
        if (month in monthlyVolume) {
          const volume = Number(set.weightKg) * (set.reps || 0);
          monthlyVolume[month] = (monthlyVolume[month] ?? 0) + volume;
        }
      });

      // Convert to chart format and reverse for chronological order
      return Object.entries(monthlyVolume)
        .map(([month, volume]) => ({ month, desktop: Math.round(volume) }))
        .reverse();
    } catch (error) {
      logger.error('Error getting volume over time analytics:', error);
      throw error;
    }
  }

  /**
   * Helper method to map individual muscles to muscle groups
   */
  private static mapMuscleToGroup(muscle: string): string {
    const muscleMapping: { [key: string]: string } = {
      // Chest variations
      chest: 'Chest',
      pectorals: 'Chest',
      'pectoralis major': 'Chest',
      'upper chest': 'Chest',
      'lower chest': 'Chest',
      'middle chest': 'Chest',

      // Back variations
      lats: 'Back',
      'latissimus dorsi': 'Back',
      rhomboids: 'Back',
      'middle trapezius': 'Back',
      'lower trapezius': 'Back',
      'rear deltoids': 'Back',
      'erector spinae': 'Back',
      'lower back': 'Back',
      'middle back': 'Back',
      'upper back': 'Back',

      // Arms variations
      biceps: 'Arms',
      'biceps brachii': 'Arms',
      triceps: 'Arms',
      'triceps brachii': 'Arms',
      forearms: 'Arms',
      brachialis: 'Arms',
      brachioradialis: 'Arms',

      // Shoulders variations
      shoulders: 'Shoulders',
      deltoids: 'Shoulders',
      'anterior deltoids': 'Shoulders',
      'medial deltoids': 'Shoulders',
      'posterior deltoids': 'Shoulders',
      'side deltoids': 'Shoulders',
      'front deltoids': 'Shoulders',
      'upper trapezius': 'Shoulders',

      // Legs variations
      quadriceps: 'Legs',
      quads: 'Legs',
      hamstrings: 'Legs',
      glutes: 'Legs',
      'gluteus maximus': 'Legs',
      calves: 'Legs',
      'hip flexors': 'Legs',
      adductors: 'Legs',
      abductors: 'Legs',
      thighs: 'Legs',

      // Core variations
      abdominals: 'Core',
      abs: 'Core',
      obliques: 'Core',
      'serratus anterior': 'Core',
      'transverse abdominis': 'Core',
      'lower abs': 'Core',
      'upper abs': 'Core',
    };

    const normalizedMuscle = muscle.toLowerCase().trim();
    return muscleMapping[normalizedMuscle] || 'Other';
  }
}
