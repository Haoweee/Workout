import { prisma } from '@services/database';
import { CreateRoutineRequest, AddExerciseToRoutineRequest } from '@/types';
import { Visibility, Difficulty } from '@prisma/client';

export class RoutineService {
  // 📝 CREATE Operations

  /**
   * Create a new workout routine with exercises
   */
  static async createRoutine(authorId: string, routineData: CreateRoutineRequest) {
    // Handle exercises if provided, otherwise create empty routine
    if (routineData.exercises && routineData.exercises.length > 0) {
      // Separate database exercises from custom exercises
      const databaseExercises = routineData.exercises.filter((e) => e.exerciseId);
      const customExercises = routineData.exercises.filter((e) => e.customExerciseName);

      // Validate that all database exercises exist
      if (databaseExercises.length > 0) {
        const exerciseIds = databaseExercises.map((e) => e.exerciseId!);
        const existingExercises = await prisma.exercise.findMany({
          where: { id: { in: exerciseIds } },
          select: { id: true },
        });

        const existingIds = existingExercises.map((e) => e.id);
        const missingIds = exerciseIds.filter((id) => !existingIds.includes(id));

        if (missingIds.length > 0) {
          throw new Error(`Exercise(s) with ID(s) ${missingIds.join(', ')} not found`);
        }
      }

      // Validate custom exercises have names
      for (const customEx of customExercises) {
        if (!customEx.customExerciseName?.trim()) {
          throw new Error('Custom exercise name cannot be empty');
        }
      }
    }

    return await prisma.routine.create({
      data: {
        authorId,
        title: routineData.title,
        description: routineData.description ?? null,
        difficulty: routineData.difficulty ?? null,
        visibility: routineData.visibility || Visibility.PRIVATE,

        // Create related routine exercises if provided
        ...(routineData.exercises &&
          routineData.exercises.length > 0 && {
            routineExercises: {
              create: routineData.exercises.map((exercise) => ({
                dayIndex: exercise.dayIndex,
                orderIndex: exercise.orderIndex,
                sets: exercise.sets ?? null,
                reps: exercise.reps ?? null,
                restSeconds: exercise.restSeconds ?? null,
                notes: exercise.notes ?? null,
                customExerciseName: exercise.customExerciseName ?? null,
                ...(exercise.exerciseId && {
                  exercise: {
                    connect: { id: exercise.exerciseId },
                  },
                }),
              })),
            },
          }),
      },
      include: {
        author: {
          select: { id: true, username: true, fullName: true, avatarUrl: true },
        },
        routineExercises: {
          include: {
            exercise: {
              select: { id: true, name: true, equipment: true, primaryMuscles: true },
            },
          },
          orderBy: [{ dayIndex: 'asc' }, { orderIndex: 'asc' }],
        },
        votes: {
          select: {
            value: true,
            user: {
              select: { username: true },
            },
          },
        },
        _count: {
          select: {
            votes: true,
            workouts: true,
          },
        },
      },
    });
  }

  // 📖 READ Operations

  /**
   * Get routine exercises by ID with all exercises
   */
  static async getRoutineById(id: string) {
    return await prisma.routine.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, username: true, fullName: true, avatarUrl: true },
        },
        routineExercises: {
          include: {
            exercise: {
              select: { id: true, name: true, equipment: true, primaryMuscles: true },
            },
          },
          orderBy: [{ dayIndex: 'asc' }, { orderIndex: 'asc' }],
        },
        votes: {
          select: {
            value: true,
            user: {
              select: { username: true },
            },
          },
        },
        _count: {
          select: {
            votes: true,
            workouts: true, // How many times this routine was used
          },
        },
      },
    });
  }

  /**
   * Get public routines with pagination and filters
   */
  static async getPublicRoutines(filters: {
    difficulty?: Difficulty;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { difficulty, search, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where = {
      visibility: Visibility.PUBLIC,
      // Only show routines created by user "chi"
      author: {
        username: 'chi',
      },
      // Filter out cloned routines completely
      isCloned: false,
      ...(difficulty && { difficulty }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [routines, total] = await Promise.all([
      prisma.routine.findMany({
        where,
        include: {
          author: {
            select: { username: true, fullName: true, avatarUrl: true },
          },
          _count: {
            select: { votes: true, routineExercises: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.routine.count({ where }),
    ]);

    return {
      routines,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // ✏️ UPDATE Operations

  /**
   * Update routine details and exercises
   */
  static async updateRoutine(
    id: string,
    authorId: string,
    updates: {
      title?: string;
      description?: string;
      difficulty?: Difficulty;
      visibility?: Visibility;
      exercises?: {
        exerciseId?: number;
        customExerciseName?: string;
        dayIndex: number;
        orderIndex: number;
        sets?: string;
        reps?: string;
        restSeconds?: number;
        notes?: string;
      }[];
    }
  ) {
    // Use a transaction to update both routine and exercises atomically
    return await prisma.$transaction(async (tx) => {
      // Prepare update data, filtering out undefined values
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.difficulty !== undefined) updateData.difficulty = updates.difficulty;
      if (updates.visibility !== undefined) updateData.visibility = updates.visibility;

      // Update the routine basic information
      await tx.routine.update({
        where: {
          id,
          authorId, // Ensure only the author can update
        },
        data: updateData,
      });

      // If exercises are provided, replace all existing exercises
      if (updates.exercises) {
        // First, delete all existing routine exercises
        await tx.routineExercise.deleteMany({
          where: { routineId: id },
        });

        // Then, create new routine exercises
        if (updates.exercises.length > 0) {
          // Validate database exercises exist
          const databaseExercises = updates.exercises.filter((e) => e.exerciseId);
          if (databaseExercises.length > 0) {
            const exerciseIds = databaseExercises.map((e) => e.exerciseId!);
            const existingExercises = await tx.exercise.findMany({
              where: { id: { in: exerciseIds } },
              select: { id: true },
            });

            const existingIds = existingExercises.map((e) => e.id);
            const missingIds = exerciseIds.filter((id) => !existingIds.includes(id));

            if (missingIds.length > 0) {
              throw new Error(`Exercise(s) with ID(s) ${missingIds.join(', ')} not found`);
            }
          }

          // Create routine exercises (both database and custom)
          for (const exercise of updates.exercises) {
            const exerciseData: any = {
              routineId: id,
              customExerciseName: exercise.customExerciseName || null,
              dayIndex: exercise.dayIndex,
              orderIndex: exercise.orderIndex,
              sets: exercise.sets || null,
              reps: exercise.reps || null,
              restSeconds: exercise.restSeconds || null,
              notes: exercise.notes || null,
            };

            // Only add exerciseId if it exists (for database exercises)
            if (exercise.exerciseId) {
              exerciseData.exerciseId = exercise.exerciseId;
            }

            await tx.routineExercise.create({
              data: exerciseData,
            });
          }
        }
      }

      // Return the updated routine with exercises
      return await tx.routine.findUnique({
        where: { id },
        include: {
          routineExercises: {
            include: { exercise: true },
            orderBy: [{ dayIndex: 'asc' }, { orderIndex: 'asc' }],
          },
        },
      });
    });
  }

  // Accept an array of exercise IDs and return matching exercises
  static async getExercisesByIds(ids: string[]) {
    return await prisma.exercise.findMany({
      where: {
        id: { in: ids.map((id) => Number(id)) },
      },
      select: {
        id: true,
        name: true,
        equipment: true,
        primaryMuscles: true,
      },
    });
  }

  /**
   * Add exercise to existing routine
   */
  static async addExerciseToRoutine(
    routineId: string,
    authorId: string,
    exerciseData: AddExerciseToRoutineRequest
  ) {
    // Validate that either exerciseId or customExerciseName is provided
    if (!exerciseData.exerciseId && !exerciseData.customExerciseName) {
      throw new Error('Either exerciseId or customExerciseName must be provided');
    }

    if (exerciseData.exerciseId && exerciseData.customExerciseName) {
      throw new Error('Cannot provide both exerciseId and customExerciseName');
    }

    // If it's a database exercise, validate that it exists
    if (exerciseData.exerciseId) {
      const exercise = await prisma.exercise.findUnique({
        where: { id: exerciseData.exerciseId },
        select: { id: true },
      });

      if (!exercise) {
        throw new Error(`Exercise with ID ${exerciseData.exerciseId} not found`);
      }
    }

    // Validate custom exercise name if provided
    if (exerciseData.customExerciseName && !exerciseData.customExerciseName.trim()) {
      throw new Error('Custom exercise name cannot be empty');
    }

    // Validate that the routine exists and belongs to the user
    const routine = await prisma.routine.findUnique({
      where: { id: routineId, authorId },
      select: { id: true },
    });

    if (!routine) {
      throw new Error('Routine not found or you do not have permission to modify it');
    }

    // If orderIndex is not provided, calculate the next available one for this day
    let finalOrderIndex = exerciseData.orderIndex;
    if (finalOrderIndex === undefined || finalOrderIndex === null) {
      const maxOrderIndex = await prisma.routineExercise.findFirst({
        where: {
          routineId,
          dayIndex: exerciseData.dayIndex,
        },
        orderBy: { orderIndex: 'desc' },
        select: { orderIndex: true },
      });

      finalOrderIndex = (maxOrderIndex?.orderIndex ?? -1) + 1;
    } else {
      // Check if this orderIndex is already taken for this day
      const existingExercise = await prisma.routineExercise.findFirst({
        where: {
          routineId,
          dayIndex: exerciseData.dayIndex,
          orderIndex: finalOrderIndex,
        },
      });

      if (existingExercise) {
        // Instead of throwing an error, auto-assign the next available orderIndex
        const maxOrderIndex = await prisma.routineExercise.findFirst({
          where: {
            routineId,
            dayIndex: exerciseData.dayIndex,
          },
          orderBy: { orderIndex: 'desc' },
          select: { orderIndex: true },
        });

        finalOrderIndex = (maxOrderIndex?.orderIndex ?? -1) + 1;
      }
    }

    // Prepare data for creation
    const createData: any = {
      routineId,
      customExerciseName: exerciseData.customExerciseName || null,
      dayIndex: exerciseData.dayIndex,
      orderIndex: finalOrderIndex,
      sets: exerciseData.sets ?? null,
      reps: exerciseData.reps ?? null,
      restSeconds: exerciseData.restSeconds ?? null,
      notes: exerciseData.notes ?? null,
    };

    // Only add exerciseId if it exists (for database exercises)
    if (exerciseData.exerciseId) {
      createData.exerciseId = exerciseData.exerciseId;
    }

    return await prisma.routineExercise.create({
      data: createData,
      include: {
        exercise: exerciseData.exerciseId
          ? {
              select: { id: true, name: true, equipment: true, primaryMuscles: true },
            }
          : false,
      },
    });
  }

  /**
   * Update exercise in routine
   */
  static async updateRoutineExercise(
    id: string,
    updates: {
      sets?: string; // Changed to string for ranges like "3-4"
      reps?: string; // Changed to string for ranges like "8-10"
      restSeconds?: number;
      notes?: string;
      orderIndex?: number;
    }
  ) {
    return await prisma.routineExercise.update({
      where: { id },
      data: updates,
      include: {
        exercise: true,
      },
    });
  }

  // 🗑️ DELETE Operations

  /**
   * Remove exercise from routine
   */
  static async removeExerciseFromRoutine(routineExerciseId: string, authorId: string) {
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(routineExerciseId)) {
      throw new Error(
        `Invalid routine exercise ID format. Expected UUID, received: "${routineExerciseId}"`
      );
    }

    // First check if the routine exercise exists and the user owns the routine
    const routineExercise = await prisma.routineExercise.findUnique({
      where: { id: routineExerciseId },
      include: { routine: { select: { authorId: true } } },
    });

    if (!routineExercise) {
      throw new Error('Exercise not found in routine');
    }

    if (routineExercise.routine.authorId !== authorId) {
      throw new Error('You do not have permission to modify this routine');
    }

    return await prisma.routineExercise.delete({
      where: { id: routineExerciseId },
    });
  }

  /**
   * Delete entire routine
   */
  static async deleteRoutine(id: string, authorId: string) {
    // First check if the routine exists and belongs to the user
    const routine = await prisma.routine.findUnique({
      where: { id, authorId },
      select: { id: true },
    });

    if (!routine) {
      throw new Error('Routine not found');
    }

    // Delete the routine - the database will handle setting originalRoutineId to NULL for cloned routines
    return await prisma.routine.delete({
      where: {
        id,
        authorId, // Ensure only author can delete
      },
    });
  }

  // 🗳️ VOTING OPERATIONS

  /**
   * Vote on a routine (upvote/downvote)
   */
  static async voteOnRoutine(userId: string, routineId: string, value: 1 | -1) {
    return await prisma.routineVote.upsert({
      where: {
        userId_routineId: {
          userId,
          routineId,
        },
      },
      update: { value },
      create: {
        userId,
        routineId,
        value,
      },
    });
  }

  /**
   * Remove vote from routine
   */
  static async removeVote(userId: string, routineId: string) {
    return await prisma.routineVote.delete({
      where: {
        userId_routineId: {
          userId,
          routineId,
        },
      },
    });
  }

  /**
   * Get routine vote summary
   */
  static async getRoutineVotes(routineId: string) {
    const votes = await prisma.routineVote.groupBy({
      by: ['value'],
      where: { routineId },
      _count: { value: true },
    });

    const upvotes = votes.find((v) => v.value === 1)?._count.value || 0;
    const downvotes = votes.find((v) => v.value === -1)?._count.value || 0;

    return {
      upvotes,
      downvotes,
      total: upvotes + downvotes,
      score: upvotes - downvotes,
    };
  }

  // 📊 COMPLEX OPERATIONS

  /**
   * Get user's routines with usage stats (including exercises grouped by day)
   */
  static async getUserRoutines(authorId: string) {
    const routines = await prisma.routine.findMany({
      where: { authorId },
      include: {
        routineExercises: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                equipment: true,
                primaryMuscles: true,
                secondaryMuscles: true,
                category: true,
                level: true,
              },
            },
          },
          orderBy: [{ dayIndex: 'asc' }, { orderIndex: 'asc' }],
        },
        _count: {
          select: {
            routineExercises: true,
            votes: true,
            workouts: true, // Times this routine was used for workouts
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform routines to group exercises by day
    return routines.map((routine) => {
      // Group exercises by dayIndex
      const exercisesByDay = routine.routineExercises.reduce(
        (acc, routineExercise) => {
          const dayIndex = routineExercise.dayIndex;
          if (!acc[dayIndex]) {
            acc[dayIndex] = [];
          }

          // Clean up the exercise data by removing redundant fields
          const cleanExercise = {
            id: routineExercise.id,
            orderIndex: routineExercise.orderIndex,
            sets: routineExercise.sets,
            reps: routineExercise.reps,
            restSeconds: routineExercise.restSeconds,
            notes: routineExercise.notes,
            customExerciseName: routineExercise.customExerciseName,
            exercise: routineExercise.exercise,
          };

          // TypeScript needs explicit assertion after the check above
          acc[dayIndex]!.push(cleanExercise);
          return acc;
        },
        {} as Record<number, any[]>
      );

      // Convert to array format with day information
      const days = Object.entries(exercisesByDay)
        .map(([dayIndex, exercises]) => ({
          dayIndex: parseInt(dayIndex),
          exercises: exercises,
        }))
        .sort((a, b) => a.dayIndex - b.dayIndex);

      return {
        id: routine.id,
        title: routine.title,
        description: routine.description,
        difficulty: routine.difficulty,
        visibility: routine.visibility,
        createdAt: routine.createdAt,
        updatedAt: routine.updatedAt,
        days: days,
        totalDays: days.length,
        _count: routine._count,
      };
    });
  }

  /**
   * Clone/fork a routine for another user
   */
  static async cloneRoutine(originalRoutineId: string, newAuthorId: string, newTitle?: string) {
    return await prisma.$transaction(async (tx) => {
      // Get original routine with exercises
      const originalRoutine = await tx.routine.findUnique({
        where: { id: originalRoutineId },
        include: {
          routineExercises: true,
        },
      });

      if (!originalRoutine) {
        throw new Error('Routine not found');
      }

      // Create new routine with full structure
      const newRoutine = await tx.routine.create({
        data: {
          authorId: newAuthorId,
          title: newTitle || `${originalRoutine.title} (Copy)`,
          description: originalRoutine.description,
          difficulty: originalRoutine.difficulty,
          visibility: Visibility.PRIVATE, // Always start as private
          isCloned: true, // Mark as cloned
          originalRoutineId: originalRoutineId, // Track original routine

          routineExercises: {
            create: originalRoutine.routineExercises.map(
              ({ id: _id, routineId: _routineId, ...exercise }) => exercise
            ),
          },
        } as any, // Cast to avoid type mismatch
        include: {
          author: {
            select: { id: true, username: true, fullName: true, avatarUrl: true },
          },
          routineExercises: {
            include: {
              exercise: {
                select: { id: true, name: true, equipment: true, primaryMuscles: true },
              },
            },
            orderBy: [{ dayIndex: 'asc' }, { orderIndex: 'asc' }],
          },
          votes: {
            select: {
              value: true,
              user: {
                select: { username: true },
              },
            },
          },
          _count: {
            select: {
              votes: true,
              workouts: true,
            },
          },
        },
      });

      return newRoutine;
    });
  }
}
