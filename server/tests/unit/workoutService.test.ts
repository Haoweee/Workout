import { WorkoutService } from '../../src/services/workoutService';
import { Visibility } from '@prisma/client';
import { testPrisma } from '../setup';

describe('WorkoutService', () => {
  let testUser: { id: string; email: string; username: string; fullName: string };
  let testRoutine: any;
  let testExercise: { id: number; name: string };

  // Helper function to create a test user
  const createTestUser = async () => {
    return await testPrisma.user.create({
      data: {
        email: 'user123@example.com',
        username: 'user123',
        fullName: 'User 123',
        passwordHash: 'hashedpassword123',
      },
    });
  };

  // Helper function to create a test exercise
  const createTestExercise = async () => {
    return await testPrisma.exercise.create({
      data: {
        name: 'Push Up',
        category: 'STRENGTH',
        primaryMuscles: ['Chest'],
        exerciseId: 'push-up-001',
        images: [],
      },
    });
  };

  // Helper function to create a test routine
  const createTestRoutine = async (userId: string) => {
    return await testPrisma.routine.create({
      data: {
        authorId: userId,
        title: 'Test Routine',
        description: 'Test routine for workouts',
        visibility: Visibility.PUBLIC,
      },
    });
  };

  beforeEach(async () => {
    // Clean up and create fresh data for each test
    await testPrisma.workoutSet.deleteMany();
    await testPrisma.workout.deleteMany();
    await testPrisma.routineExercise.deleteMany();
    await testPrisma.routine.deleteMany();
    await testPrisma.exercise.deleteMany();
    await testPrisma.user.deleteMany();

    testUser = await createTestUser();
    testExercise = await createTestExercise();
    testRoutine = await createTestRoutine(testUser.id);
  });

  afterAll(async () => {
    // Clean up after all tests
    await testPrisma.workoutSet.deleteMany();
    await testPrisma.workout.deleteMany();
    await testPrisma.routineExercise.deleteMany();
    await testPrisma.routine.deleteMany();
    await testPrisma.exercise.deleteMany();
    await testPrisma.user.deleteMany();
  });

  describe('createWorkout', () => {
    it('should create a workout from routine successfully', async () => {
      const workoutData = {
        routineId: testRoutine.id,
        title: 'Morning Session',
      };

      const workout = await WorkoutService.createWorkout(testUser.id, workoutData);

      expect(workout).toBeDefined();
      expect(workout.userId).toBe(testUser.id);
      expect(workout.routineId).toBe(testRoutine.id);
      expect(workout.title).toBe('Morning Session');
      expect(workout.startedAt).toBeDefined();
    });

    it('should create a workout without routine', async () => {
      const workoutData = {
        title: 'Quick Session',
      };

      const workout = await WorkoutService.createWorkout(testUser.id, workoutData);

      expect(workout.title).toBe('Quick Session');
      expect(workout.routineId).toBeNull();
      expect(workout.userId).toBe(testUser.id);
    });

    it('should create workout with visibility setting', async () => {
      const workoutData = {
        title: 'Private Session',
        visibility: Visibility.PRIVATE,
      };

      const workout = await WorkoutService.createWorkout(testUser.id, workoutData);

      expect(workout.visibility).toBe(Visibility.PRIVATE);
    });
  });

  describe('getUserWorkouts', () => {
    beforeEach(async () => {
      // Create some test workouts
      await testPrisma.workout.createMany({
        data: [
          {
            userId: testUser.id,
            routineId: testRoutine.id,
            title: 'Completed Workout',
            visibility: Visibility.PUBLIC,
            startedAt: new Date('2023-01-01'),
            finishedAt: new Date('2023-01-01'),
          },
          {
            userId: testUser.id,
            routineId: testRoutine.id,
            title: 'In Progress Workout',
            visibility: Visibility.PRIVATE,
            startedAt: new Date('2023-01-02'),
          },
          {
            userId: testUser.id,
            title: 'Custom Workout',
            visibility: Visibility.PUBLIC,
            startedAt: new Date('2023-01-03'),
            finishedAt: new Date('2023-01-03'),
          },
        ],
      });
    });

    it('should return all user workouts', async () => {
      const result = await WorkoutService.getUserWorkouts(testUser.id);

      expect(result.workouts).toHaveLength(3);
      expect(result.workouts.every((w) => w.userId === testUser.id)).toBe(true);
      expect(result.total).toBe(3);
    });

    it('should filter workouts by includeFinished', async () => {
      const result = await WorkoutService.getUserWorkouts(testUser.id, {
        includeFinished: false,
      });

      expect(result.workouts).toHaveLength(1);
      expect(result.workouts[0]?.finishedAt).toBeNull();
    });

    it('should limit and offset workouts correctly', async () => {
      const result = await WorkoutService.getUserWorkouts(testUser.id, {
        limit: 2,
        offset: 1,
      });

      expect(result.workouts).toHaveLength(2);
      expect(result.total).toBe(3);
    });

    it('should filter by routineId', async () => {
      const result = await WorkoutService.getUserWorkouts(testUser.id, {
        routineId: testRoutine.id,
      });

      expect(result.workouts).toHaveLength(2);
      expect(result.workouts.every((w) => w.routineId === testRoutine.id)).toBe(true);
    });
  });

  describe('getWorkoutById', () => {
    let testWorkout: any;

    beforeEach(async () => {
      testWorkout = await testPrisma.workout.create({
        data: {
          userId: testUser.id,
          routineId: testRoutine.id,
          title: 'Test Workout',
          visibility: Visibility.PRIVATE,
          startedAt: new Date(),
        },
      });
    });

    it('should retrieve a workout by ID', async () => {
      const result = await WorkoutService.getWorkoutById(testWorkout.id, testUser.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(testWorkout.id);
      expect(result?.userId).toBe(testUser.id);
      expect(result?.title).toBe('Test Workout');
    });

    it('should return null for non-existent workout', async () => {
      const result = await WorkoutService.getWorkoutById(
        '550e8400-e29b-41d4-a716-446655440000',
        testUser.id
      );
      expect(result).toBeNull();
    });
  });

  describe('updateWorkout', () => {
    let testWorkout: any;

    beforeEach(async () => {
      testWorkout = await testPrisma.workout.create({
        data: {
          userId: testUser.id,
          title: 'Original Title',
          visibility: Visibility.PRIVATE,
          startedAt: new Date(),
        },
      });
    });

    it('should update workout successfully', async () => {
      const updates = {
        title: 'Updated Title',
        visibility: Visibility.PUBLIC,
      };

      const result = await WorkoutService.updateWorkout(testWorkout.id, testUser.id, updates);

      expect(result.title).toBe(updates.title);
      expect(result.visibility).toBe(updates.visibility);
    });

    it('should throw error when user is not the owner', async () => {
      const otherUser = await testPrisma.user.create({
        data: {
          email: 'other@example.com',
          username: 'otheruser',
          fullName: 'Other User',
          passwordHash: 'hashedpassword',
        },
      });

      await expect(
        WorkoutService.updateWorkout(testWorkout.id, otherUser.id, { title: 'Hacked' })
      ).rejects.toThrow('Workout not found or access denied');
    });
  });

  describe('deleteWorkout', () => {
    let testWorkout: any;

    beforeEach(async () => {
      testWorkout = await testPrisma.workout.create({
        data: {
          userId: testUser.id,
          title: 'To Delete',
          visibility: Visibility.PRIVATE,
          startedAt: new Date(),
        },
      });
    });

    it('should delete workout successfully', async () => {
      await WorkoutService.deleteWorkout(testWorkout.id, testUser.id);

      const deletedWorkout = await testPrisma.workout.findUnique({
        where: { id: testWorkout.id },
      });

      expect(deletedWorkout).toBeNull();
    });

    it('should throw error when user is not the owner', async () => {
      const otherUser = await testPrisma.user.create({
        data: {
          email: 'other@example.com',
          username: 'otheruser',
          fullName: 'Other User',
          passwordHash: 'hashedpassword',
        },
      });

      await expect(WorkoutService.deleteWorkout(testWorkout.id, otherUser.id)).rejects.toThrow(
        'Workout not found or access denied'
      );
    });
  });

  describe('addWorkoutSet', () => {
    let testWorkout: any;

    beforeEach(async () => {
      testWorkout = await testPrisma.workout.create({
        data: {
          userId: testUser.id,
          title: 'Test Workout',
          visibility: Visibility.PRIVATE,
          startedAt: new Date(),
        },
      });
    });

    it('should add workout set with exercise successfully', async () => {
      const setData = {
        exerciseId: testExercise.id,
        reps: 10,
        weightKg: 50.5,
        notes: 'Good form',
      };

      const result = await WorkoutService.addWorkoutSet(testWorkout.id, testUser.id, setData);

      expect(result.exerciseId).toBe(testExercise.id);
      expect(result.reps).toBe(10);
      expect(result.weightKg?.toString()).toBe('50.5');
      expect(result.notes).toBe('Good form');
    });

    it('should add workout set with custom exercise successfully', async () => {
      const setData = {
        customExerciseName: 'My Custom Exercise',
        customExerciseCategory: 'STRENGTH',
        customExercisePrimaryMuscles: ['Arms'],
        reps: 12,
        weightKg: 25,
      };

      const result = await WorkoutService.addWorkoutSet(testWorkout.id, testUser.id, setData);

      expect(result.customExerciseName).toBe('My Custom Exercise');
      expect(result.customExerciseCategory).toBe('STRENGTH');
      expect(result.customExercisePrimaryMuscles).toEqual(['Arms']);
      expect(result.reps).toBe(12);
    });

    it('should throw error when neither exercise nor custom exercise is provided', async () => {
      const setData = {
        reps: 10,
      };

      await expect(
        WorkoutService.addWorkoutSet(testWorkout.id, testUser.id, setData)
      ).rejects.toThrow('Either exerciseId or customExerciseName must be provided');
    });

    it('should throw error when workout does not exist or access denied', async () => {
      const otherUser = await testPrisma.user.create({
        data: {
          email: 'other@example.com',
          username: 'otheruser',
          fullName: 'Other User',
          passwordHash: 'hashedpassword',
        },
      });

      const setData = {
        exerciseId: testExercise.id,
        reps: 10,
      };

      await expect(
        WorkoutService.addWorkoutSet(testWorkout.id, otherUser.id, setData)
      ).rejects.toThrow('Workout not found or access denied');
    });
  });

  describe('updateWorkoutSet', () => {
    let testWorkout: any;
    let testWorkoutSet: any;

    beforeEach(async () => {
      testWorkout = await testPrisma.workout.create({
        data: {
          userId: testUser.id,
          title: 'Test Workout',
          visibility: Visibility.PRIVATE,
          startedAt: new Date(),
        },
      });

      testWorkoutSet = await testPrisma.workoutSet.create({
        data: {
          workoutId: testWorkout.id,
          exerciseId: testExercise.id,
          reps: 10,
          weightKg: 50,
          setNumber: 1,
        },
      });
    });

    it('should update workout set successfully', async () => {
      const updates = {
        reps: 12,
        weightKg: 55,
        notes: 'Increased weight',
      };

      const result = await WorkoutService.updateWorkoutSet(testWorkoutSet.id, testUser.id, updates);

      expect(result.reps).toBe(12);
      expect(result.weightKg?.toString()).toBe('55');
      expect(result.notes).toBe('Increased weight');
    });

    it('should throw error when set does not belong to user', async () => {
      const otherUser = await testPrisma.user.create({
        data: {
          email: 'other@example.com',
          username: 'otheruser',
          fullName: 'Other User',
          passwordHash: 'hashedpassword',
        },
      });

      await expect(
        WorkoutService.updateWorkoutSet(testWorkoutSet.id, otherUser.id, { reps: 15 })
      ).rejects.toThrow('Workout set not found or access denied');
    });
  });

  describe('deleteWorkoutSet', () => {
    let testWorkout: any;
    let testWorkoutSet: any;

    beforeEach(async () => {
      testWorkout = await testPrisma.workout.create({
        data: {
          userId: testUser.id,
          title: 'Test Workout',
          visibility: Visibility.PRIVATE,
          startedAt: new Date(),
        },
      });

      testWorkoutSet = await testPrisma.workoutSet.create({
        data: {
          workoutId: testWorkout.id,
          exerciseId: testExercise.id,
          reps: 10,
          weightKg: 50,
          setNumber: 1,
        },
      });
    });

    it('should delete workout set successfully', async () => {
      await WorkoutService.deleteWorkoutSet(testWorkoutSet.id, testUser.id);

      const deletedSet = await testPrisma.workoutSet.findUnique({
        where: { id: testWorkoutSet.id },
      });

      expect(deletedSet).toBeNull();
    });

    it('should throw error when set does not belong to user', async () => {
      const otherUser = await testPrisma.user.create({
        data: {
          email: 'other@example.com',
          username: 'otheruser',
          fullName: 'Other User',
          passwordHash: 'hashedpassword',
        },
      });

      await expect(
        WorkoutService.deleteWorkoutSet(testWorkoutSet.id, otherUser.id)
      ).rejects.toThrow('Workout set not found or access denied');
    });
  });

  describe('finishWorkout', () => {
    let testWorkout: any;

    beforeEach(async () => {
      testWorkout = await testPrisma.workout.create({
        data: {
          userId: testUser.id,
          title: 'Test Workout',
          visibility: Visibility.PRIVATE,
          startedAt: new Date(),
        },
      });
    });

    it('should finish workout successfully', async () => {
      const result = await WorkoutService.finishWorkout(testWorkout.id, testUser.id);

      expect(result.finishedAt).toBeDefined();
    });

    it('should be able to update finishedAt multiple times', async () => {
      // First finish the workout
      await WorkoutService.finishWorkout(testWorkout.id, testUser.id);

      // Finish it again (should work since finishWorkout just sets finishedAt)
      const result = await WorkoutService.finishWorkout(testWorkout.id, testUser.id);
      expect(result.finishedAt).toBeDefined();
    });

    it('should throw error when workout does not belong to user', async () => {
      const otherUser = await testPrisma.user.create({
        data: {
          email: 'other@example.com',
          username: 'otheruser',
          fullName: 'Other User',
          passwordHash: 'hashedpassword',
        },
      });

      await expect(WorkoutService.finishWorkout(testWorkout.id, otherUser.id)).rejects.toThrow(
        'Workout not found or access denied'
      );
    });
  });

  describe('getWorkoutStats', () => {
    beforeEach(async () => {
      // Create completed workouts
      const workout1 = await testPrisma.workout.create({
        data: {
          userId: testUser.id,
          title: 'Workout 1',
          visibility: Visibility.PRIVATE,
          startedAt: new Date('2023-01-01T10:00:00Z'),
          finishedAt: new Date('2023-01-01T11:00:00Z'),
        },
      });

      const workout2 = await testPrisma.workout.create({
        data: {
          userId: testUser.id,
          title: 'Workout 2',
          visibility: Visibility.PRIVATE,
          startedAt: new Date('2023-01-02T10:00:00Z'),
          finishedAt: new Date('2023-01-02T11:15:00Z'),
        },
      });

      // Add workout sets for volume calculation
      await testPrisma.workoutSet.createMany({
        data: [
          {
            workoutId: workout1.id,
            exerciseId: testExercise.id,
            reps: 10,
            weightKg: 100,
            setNumber: 1,
          },
          {
            workoutId: workout1.id,
            exerciseId: testExercise.id,
            reps: 8,
            weightKg: 110,
            setNumber: 2,
          },
          {
            workoutId: workout2.id,
            exerciseId: testExercise.id,
            reps: 12,
            weightKg: 95,
            setNumber: 1,
          },
        ],
      });
    });

    it('should return workout statistics', async () => {
      const stats = await WorkoutService.getWorkoutStats(testUser.id);

      expect(stats.totalWorkouts).toBe(2);
      expect(stats.totalSets).toBe(3);
      expect(stats.totalVolume).toBeGreaterThan(0); // Just check that volume is calculated
      expect(stats.averageWorkoutDuration).toBeGreaterThan(0);
      expect(stats.workoutsThisWeek).toBeDefined();
      expect(stats.workoutsThisMonth).toBeDefined();
    });

    it('should return zero stats for user with no workouts', async () => {
      const newUser = await testPrisma.user.create({
        data: {
          email: 'newuser@example.com',
          username: 'newuser',
          fullName: 'New User',
          passwordHash: 'hashedpassword',
        },
      });

      const stats = await WorkoutService.getWorkoutStats(newUser.id);

      expect(stats.totalWorkouts).toBe(0);
      expect(stats.totalSets).toBe(0);
      expect(stats.totalVolume).toBe(0);
      expect(stats.averageWorkoutDuration).toBe(0);
      expect(stats.workoutsThisWeek).toBe(0);
      expect(stats.workoutsThisMonth).toBe(0);
    });
  });
});
