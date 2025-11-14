import { RoutineService } from '../../src/services/routineService';
import { Visibility, Difficulty } from '@prisma/client';
import { testPrisma } from '../setup';

describe('RoutineService', () => {
  let testUser: { id: string; email: string; username: string; fullName: string };
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

  beforeEach(async () => {
    // Clean up and create fresh data for each test
    await testPrisma.routineVote.deleteMany();
    await testPrisma.routineExercise.deleteMany();
    await testPrisma.routine.deleteMany();
    await testPrisma.exercise.deleteMany();
    await testPrisma.user.deleteMany();

    testUser = await createTestUser();
    testExercise = await createTestExercise();
  });

  afterAll(async () => {
    // Clean up after all tests
    await testPrisma.routineVote.deleteMany();
    await testPrisma.routineExercise.deleteMany();
    await testPrisma.routine.deleteMany();
    await testPrisma.exercise.deleteMany();
    await testPrisma.user.deleteMany();
  });

  describe('createRoutine', () => {
    it('should create a basic routine successfully', async () => {
      const routineData = {
        title: 'Morning Workout',
        description: 'A quick morning routine',
        visibility: Visibility.PUBLIC,
      };

      const routine = await RoutineService.createRoutine(testUser.id, routineData);

      expect(routine).toBeDefined();
      expect(routine.title).toBe(routineData.title);
      expect(routine.description).toBe(routineData.description);
      expect(routine.visibility).toBe(routineData.visibility);
      expect(routine.authorId).toBe(testUser.id);
    });

    it('should create a routine with exercises', async () => {
      const routineData = {
        title: 'Full Body Workout',
        description: 'Complete workout routine',
        visibility: Visibility.PUBLIC,
        exercises: [
          {
            exerciseId: testExercise.id,
            dayIndex: 0,
            orderIndex: 0,
            sets: '3',
            reps: '10',
            restSeconds: 60,
            notes: 'Focus on form',
          },
        ],
      };

      const routine = await RoutineService.createRoutine(testUser.id, routineData);

      expect(routine.routineExercises).toHaveLength(1);
      expect(routine.routineExercises[0]).toMatchObject({
        exerciseId: testExercise.id,
        dayIndex: 0,
        orderIndex: 0,
        sets: '3',
        reps: '10',
        restSeconds: 60,
        notes: 'Focus on form',
      });
    });

    it('should create a routine with custom exercises', async () => {
      const routineData = {
        title: 'Custom Workout',
        description: 'Workout with custom exercises',
        visibility: Visibility.PRIVATE,
        exercises: [
          {
            customExerciseName: 'My Custom Exercise',
            dayIndex: 0,
            orderIndex: 0,
            sets: '4',
            reps: '12',
          },
        ],
      };

      const routine = await RoutineService.createRoutine(testUser.id, routineData);

      expect(routine.routineExercises).toHaveLength(1);
      expect(routine.routineExercises[0]?.customExerciseName).toBe('My Custom Exercise');
    });

    it('should throw error for non-existent exercise ID', async () => {
      const routineData = {
        title: 'Invalid Workout',
        description: 'Workout with invalid exercise',
        visibility: Visibility.PRIVATE,
        exercises: [
          {
            exerciseId: 99999, // Non-existent ID
            dayIndex: 0,
            orderIndex: 0,
          },
        ],
      };

      await expect(RoutineService.createRoutine(testUser.id, routineData)).rejects.toThrow(
        'Exercise(s) with ID(s) 99999 not found'
      );
    });

    it('should throw error for empty custom exercise name', async () => {
      const routineData = {
        title: 'Invalid Custom Workout',
        description: 'Workout with empty custom exercise',
        visibility: Visibility.PRIVATE,
        exercises: [
          {
            customExerciseName: '   ', // Empty name
            dayIndex: 0,
            orderIndex: 0,
          },
        ],
      };

      await expect(RoutineService.createRoutine(testUser.id, routineData)).rejects.toThrow(
        'Custom exercise name cannot be empty'
      );
    });
  });

  describe('getRoutineById', () => {
    it('should retrieve a routine by ID', async () => {
      const routine = await testPrisma.routine.create({
        data: {
          authorId: testUser.id,
          title: 'Test Routine',
          description: 'Test description',
          visibility: Visibility.PUBLIC,
        },
      });

      const result = await RoutineService.getRoutineById(routine.id);

      expect(result).toBeDefined();
      expect(result?.id).toBe(routine.id);
      expect(result?.title).toBe('Test Routine');
    });

    it('should return null for non-existent routine', async () => {
      const result = await RoutineService.getRoutineById('550e8400-e29b-41d4-a716-446655440000');
      expect(result).toBeNull();
    });
  });

  describe('getPublicRoutines', () => {
    let chiUser: { id: string; username: string };

    beforeEach(async () => {
      // Create a user with username 'chi' as required by getPublicRoutines
      chiUser = await testPrisma.user.create({
        data: {
          email: 'chi@example.com',
          username: 'chi',
          fullName: 'Chi User',
          passwordHash: 'hashedpassword',
        },
      });

      // Create some test routines for the chi user
      await Promise.all([
        testPrisma.routine.create({
          data: {
            authorId: chiUser.id,
            title: 'Public Routine 1',
            visibility: Visibility.PUBLIC,
            difficulty: Difficulty.BEGINNER,
            isCloned: false,
          },
        }),
        testPrisma.routine.create({
          data: {
            authorId: chiUser.id,
            title: 'Private Routine',
            visibility: Visibility.PRIVATE,
            difficulty: Difficulty.INTERMEDIATE,
            isCloned: false,
          },
        }),
        testPrisma.routine.create({
          data: {
            authorId: chiUser.id,
            title: 'Public Routine 2',
            visibility: Visibility.PUBLIC,
            difficulty: Difficulty.ADVANCED,
            isCloned: false,
          },
        }),
      ]);
    });

    it('should return only public routines from chi user', async () => {
      const result = await RoutineService.getPublicRoutines({});

      expect(result.routines).toHaveLength(2);
      expect(result.routines.every((r) => r.visibility === Visibility.PUBLIC)).toBe(true);
    });

    it('should filter routines by difficulty', async () => {
      const result = await RoutineService.getPublicRoutines({
        difficulty: Difficulty.BEGINNER,
      });

      expect(result.routines).toHaveLength(1);
      expect(result.routines[0]?.difficulty).toBe(Difficulty.BEGINNER);
    });

    it('should paginate results correctly', async () => {
      const result = await RoutineService.getPublicRoutines({
        page: 1,
        limit: 1,
      });

      expect(result.routines).toHaveLength(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(1);
      expect(result.pagination.total).toBe(2);
    });
  });

  describe('updateRoutine', () => {
    let testRoutine: any;

    beforeEach(async () => {
      testRoutine = await testPrisma.routine.create({
        data: {
          authorId: testUser.id,
          title: 'Original Title',
          description: 'Original description',
          visibility: Visibility.PRIVATE,
        },
      });
    });

    it('should update routine successfully', async () => {
      const updates = {
        title: 'Updated Title',
        description: 'Updated description',
        visibility: Visibility.PUBLIC,
      };

      const result = await RoutineService.updateRoutine(testRoutine.id, testUser.id, updates);

      expect(result?.title).toBe(updates.title);
      expect(result?.description).toBe(updates.description);
      expect(result?.visibility).toBe(updates.visibility);
    });

    it('should not allow update when user is not the author', async () => {
      const otherUser = await testPrisma.user.create({
        data: {
          email: 'other@example.com',
          username: 'otheruser',
          fullName: 'Other User',
          passwordHash: 'hashedpassword',
        },
      });

      const updates = {
        title: 'Hacked Title',
      };

      // Now that we fixed the method, it should properly check authorization
      await expect(
        RoutineService.updateRoutine(testRoutine.id, otherUser.id, updates)
      ).rejects.toThrow();
    });
  });

  describe('deleteRoutine', () => {
    let testRoutine: any;

    beforeEach(async () => {
      testRoutine = await testPrisma.routine.create({
        data: {
          authorId: testUser.id,
          title: 'To Delete',
          visibility: Visibility.PRIVATE,
        },
      });
    });

    it('should delete routine successfully', async () => {
      await RoutineService.deleteRoutine(testRoutine.id, testUser.id);

      const deletedRoutine = await testPrisma.routine.findUnique({
        where: { id: testRoutine.id },
      });

      expect(deletedRoutine).toBeNull();
    });

    it('should throw error when user is not the author', async () => {
      const otherUser = await testPrisma.user.create({
        data: {
          email: 'other@example.com',
          username: 'otheruser',
          fullName: 'Other User',
          passwordHash: 'hashedpassword',
        },
      });

      await expect(RoutineService.deleteRoutine(testRoutine.id, otherUser.id)).rejects.toThrow(
        'Routine not found'
      );
    });
  });

  describe('voteOnRoutine', () => {
    let testRoutine: any;

    beforeEach(async () => {
      testRoutine = await testPrisma.routine.create({
        data: {
          authorId: testUser.id,
          title: 'Votable Routine',
          visibility: Visibility.PUBLIC,
        },
      });
    });

    it('should add upvote successfully', async () => {
      await RoutineService.voteOnRoutine(testUser.id, testRoutine.id, 1);

      const vote = await testPrisma.routineVote.findUnique({
        where: {
          userId_routineId: {
            userId: testUser.id,
            routineId: testRoutine.id,
          },
        },
      });

      expect(vote).toBeDefined();
      expect(vote?.value).toBe(1);
    });

    it('should add downvote successfully', async () => {
      await RoutineService.voteOnRoutine(testUser.id, testRoutine.id, -1);

      const vote = await testPrisma.routineVote.findUnique({
        where: {
          userId_routineId: {
            userId: testUser.id,
            routineId: testRoutine.id,
          },
        },
      });

      expect(vote?.value).toBe(-1);
    });

    it('should update existing vote', async () => {
      // First vote
      await RoutineService.voteOnRoutine(testUser.id, testRoutine.id, 1);

      // Change vote
      await RoutineService.voteOnRoutine(testUser.id, testRoutine.id, -1);

      const vote = await testPrisma.routineVote.findUnique({
        where: {
          userId_routineId: {
            userId: testUser.id,
            routineId: testRoutine.id,
          },
        },
      });

      expect(vote?.value).toBe(-1);
    });
  });

  describe('removeVote', () => {
    let testRoutine: any;

    beforeEach(async () => {
      testRoutine = await testPrisma.routine.create({
        data: {
          authorId: testUser.id,
          title: 'Votable Routine',
          visibility: Visibility.PUBLIC,
        },
      });

      // Add a vote to remove
      await testPrisma.routineVote.create({
        data: {
          userId: testUser.id,
          routineId: testRoutine.id,
          value: 1,
        },
      });
    });

    it('should remove vote successfully', async () => {
      await RoutineService.removeVote(testUser.id, testRoutine.id);

      const vote = await testPrisma.routineVote.findUnique({
        where: {
          userId_routineId: {
            userId: testUser.id,
            routineId: testRoutine.id,
          },
        },
      });

      expect(vote).toBeNull();
    });
  });

  describe('getUserRoutines', () => {
    beforeEach(async () => {
      await testPrisma.routine.createMany({
        data: [
          {
            authorId: testUser.id,
            title: 'User Routine 1',
            visibility: Visibility.PUBLIC,
          },
          {
            authorId: testUser.id,
            title: 'User Routine 2',
            visibility: Visibility.PRIVATE,
          },
        ],
      });
    });

    it('should return all routines for user', async () => {
      const result = await RoutineService.getUserRoutines(testUser.id);

      expect(result).toHaveLength(2);
      // Check that these are the user's routines by checking the structure
      expect(result[0]?.title).toBeDefined();
      expect(result[1]?.title).toBeDefined();
    });
  });

  describe('cloneRoutine', () => {
    let originalRoutine: any;
    let cloneUser: any;

    beforeEach(async () => {
      cloneUser = await testPrisma.user.create({
        data: {
          email: 'clone@example.com',
          username: 'cloneuser',
          fullName: 'Clone User',
          passwordHash: 'hashedpassword',
        },
      });

      originalRoutine = await testPrisma.routine.create({
        data: {
          authorId: testUser.id,
          title: 'Original Routine',
          description: 'Original description',
          visibility: Visibility.PUBLIC,
          routineExercises: {
            create: [
              {
                exerciseId: testExercise.id,
                dayIndex: 0,
                orderIndex: 0,
                sets: '3',
                reps: '10',
              },
            ],
          },
        },
      });
    });

    it('should clone routine successfully', async () => {
      const clonedRoutine = await RoutineService.cloneRoutine(
        originalRoutine.id,
        cloneUser.id,
        'Cloned Routine'
      );

      expect(clonedRoutine.title).toBe('Cloned Routine');
      expect(clonedRoutine.authorId).toBe(cloneUser.id);
      expect(clonedRoutine.isCloned).toBe(true);
      expect(clonedRoutine.originalRoutineId).toBe(originalRoutine.id);
      expect(clonedRoutine.routineExercises).toHaveLength(1);
    });

    it('should use default clone title when not provided', async () => {
      const clonedRoutine = await RoutineService.cloneRoutine(originalRoutine.id, cloneUser.id);

      expect(clonedRoutine.title).toBe('Original Routine (Copy)');
    });

    it('should throw error when cloning non-existent routine', async () => {
      await expect(
        RoutineService.cloneRoutine('550e8400-e29b-41d4-a716-446655440000', cloneUser.id)
      ).rejects.toThrow();
    });
  });
});
