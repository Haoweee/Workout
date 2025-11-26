import { prisma } from './database';
import { CreateUserRequest } from '@/types';
// import { User, Routine, Workout } from '@prisma/client';

export class UserService {
  // 📖 READ Operations

  /**
   * Get user by ID (without password)
   */
  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        bio: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        passwordHash: true,
        providers: {
          select: {
            provider: true,
            providerId: true,
          },
        },
      },
    });

    if (!user) return null;

    // Return hasPassword boolean instead of passwordHash
    const { passwordHash, ...rest } = user;
    return {
      ...rest,
      hasPassword: !!passwordHash && passwordHash.length > 0,
    };
  }

  /**
   * Get user with all their routines
   */
  static async getUserWithRoutines(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        createdAt: true,
        routines: {
          select: {
            id: true,
            title: true,
            description: true,
            difficulty: true,
            visibility: true,
            createdAt: true,
          },
        },
      },
    });
  }

  /**
   * Search users with pagination (also works as "get all users" when query is empty)
   */
  static async searchUsers(query: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    // Build where clause - if query is empty, get all users
    const whereClause = query.trim()
      ? {
          OR: [
            { username: { contains: query, mode: 'insensitive' as const } },
            { fullName: { contains: query, mode: 'insensitive' as const } },
          ],
        }
      : {}; // No filter = get all users

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          username: true,
          fullName: true,
          avatarUrl: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({
        where: whereClause,
      }),
    ]);

    return {
      users,
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
   * Update user profile
   */
  static async updateProfile(
    id: string,
    data: { username?: string; fullName?: string; avatarUrl?: string; bio?: string }
  ) {
    return await prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        email: true,
        bio: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Update user avatar URL
   */
  static async updateAvatar(id: string, avatarUrl: string) {
    return await prisma.user.update({
      where: { id },
      data: {
        avatarUrl,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        email: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Update user preferences (example of partial updates)
   */
  //   static async updatePreferences(id: string, preferences: any) {
  //     // You can add a preferences JSON field to your User model
  //     return await prisma.user.update({
  //       where: { id },
  //       data: {
  //         // preferences: preferences, // if you had a preferences field
  //         updatedAt: new Date(),
  //       },
  //     });
  //   }

  /**
   * Reactivate a deactivated user
   */
  static async reactivateUser(id: string) {
    // If you had an isActive field
    return await prisma.user.update({
      where: { id },
      data: {
        isActive: true,
        updatedAt: new Date(),
      },
    });
  }

  // 🗑️ DELETE Operations

  /**
   * Soft delete user (mark as inactive)
   */
  static async deactivateUser(id: string) {
    // If you had an isActive field
    return await prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Hard delete user and all related data
   */
  static async deleteUser(id: string) {
    // Prisma handles cascading deletes based on your schema relationships
    return await prisma.user.delete({
      where: { id },
    });
  }

  // 📊 COMPLEX OPERATIONS

  /**
   * Get user stats and analytics
   */
  static async getUserAnalytics(id: string) {
    const [user, routinesCount, workoutsCount, totalWorkoutSets, recentWorkouts] =
      await Promise.all([
        prisma.user.findUnique({
          where: { id },
          select: { id: true, username: true, fullName: true, createdAt: true },
        }),

        // Count routines created
        prisma.routine.count({
          where: { authorId: id },
        }),

        // Count workouts completed
        prisma.workout.count({
          where: { userId: id, finishedAt: { not: null } },
        }),

        // Count total sets performed
        prisma.workoutSet.count({
          where: {
            workout: { userId: id },
          },
        }),

        // Recent workouts with exercises
        prisma.workout.findMany({
          where: { userId: id },
          select: {
            id: true,
            title: true,
            startedAt: true,
            finishedAt: true,
            workoutSets: {
              select: {
                exercise: {
                  select: { name: true },
                },
                reps: true,
                weightKg: true,
              },
            },
          },
          orderBy: { startedAt: 'desc' },
          take: 5,
        }),
      ]);

    return {
      user,
      stats: {
        routinesCreated: routinesCount,
        workoutsCompleted: workoutsCount,
        totalSets: totalWorkoutSets,
        memberSince: user?.createdAt,
      },
      recentActivity: recentWorkouts,
    };
  }

  /**
   * Batch operations - create multiple users
   */
  static async createMultipleUsers(usersData: CreateUserRequest[]) {
    return await prisma.user.createMany({
      data: usersData.map((user) => ({
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        passwordHash: user.password, // You'd hash this first
      })),
      skipDuplicates: true, // Skip if email/username already exists
    });
  }

  /**
   * Transaction example - transfer routine ownership
   */
  static async transferRoutineOwnership(fromUserId: string, toUserId: string, routineId: string) {
    return await prisma.$transaction(async (tx) => {
      // Verify both users exist
      const [fromUser, toUser] = await Promise.all([
        tx.user.findUnique({ where: { id: fromUserId } }),
        tx.user.findUnique({ where: { id: toUserId } }),
      ]);

      if (!fromUser || !toUser) {
        throw new Error('One or both users not found');
      }

      // Transfer the routine
      const updatedRoutine = await tx.routine.update({
        where: { id: routineId, authorId: fromUserId },
        data: { authorId: toUserId },
      });

      return updatedRoutine;
    });
  }

  /**
   * Raw SQL query example (for complex analytics)
   */
  static async getWorkoutTrends(userId: string, days: number = 30) {
    const result = await prisma.$queryRaw`
      SELECT
        DATE(started_at) as workout_date,
        COUNT(*) as workout_count,
        AVG(EXTRACT(EPOCH FROM (finished_at - started_at))/60) as avg_duration_minutes
      FROM workouts
      WHERE user_id = ${userId}
        AND started_at >= NOW() - INTERVAL '${days} days'
        AND finished_at IS NOT NULL
      GROUP BY DATE(started_at)
      ORDER BY workout_date DESC
    `;

    return result;
  }
}
