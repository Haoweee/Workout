import { ExerciseService } from '../../src/services/exerciseService';
import { ExerciseType, Difficulty } from '@prisma/client';
import { testPrisma } from '../setup';

describe('ExerciseService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchExercises', () => {
    it('should retrieve exercises with filters', async () => {
      // Seed some exercises
      await testPrisma.exercise.createMany({
        data: [
          {
            name: 'Push Up',
            category: ExerciseType.STRENGTH,
            primaryMuscles: ['Chest'],
            level: Difficulty.BEGINNER,
            equipment: 'None',
            exerciseId: 'push-up-001',
            images: [],
          },
          {
            name: 'Running',
            category: ExerciseType.CARDIO,
            primaryMuscles: ['Legs'],
            level: Difficulty.INTERMEDIATE,
            equipment: 'Shoes',
            exerciseId: 'running-001',
            images: [],
          },
        ],
      });

      const filters = {
        category: ExerciseType.STRENGTH,
        primaryMuscles: 'Chest',
        level: Difficulty.BEGINNER,
        equipment: 'None',
        page: 1,
        limit: 10,
      };

      const result = await ExerciseService.getAllExercises(filters);

      expect(result.exercises.length).toBe(1);
      expect(result.exercises[0]).toMatchObject({
        name: 'Push Up',
        category: ExerciseType.STRENGTH,
        primaryMuscles: ['Chest'],
        level: Difficulty.BEGINNER,
        equipment: 'None',
      });

      // Assert pagination object
      expect(result.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: 1,
        pages: 1,
      });
    });
  });

  describe('getRandomExercises', () => {
    it('should retrieve a specified number of random exercises', async () => {
      // Seed some exercises
      await testPrisma.exercise.createMany({
        data: [
          {
            name: 'Squat',
            category: ExerciseType.STRENGTH,
            primaryMuscles: ['Legs'],
            level: Difficulty.BEGINNER,
            equipment: 'None',
            exerciseId: 'squat-001',
            images: [],
          },
          {
            name: 'Jumping Jacks',
            category: ExerciseType.CARDIO,
            primaryMuscles: ['Full Body'],
            level: Difficulty.BEGINNER,
            equipment: 'None',
            exerciseId: 'jumping-jacks-001',
            images: [],
          },
        ],
      });

      const count = 1;
      const exercises = await ExerciseService.getRandomExercises(1, count);

      expect(exercises.exercises.length).toBe(count);
      expect(['Squat', 'Jumping Jacks']).toContain(exercises.exercises[0]?.name);
    });
  });

  describe('getExerciseById', () => {
    it('should retrieve exercise by ID', async () => {
      // Seed an exercise
      const seededExercise = await testPrisma.exercise.create({
        data: {
          name: 'Plank',
          category: ExerciseType.STRENGTH,
          primaryMuscles: ['Core'],
          level: Difficulty.INTERMEDIATE,
          equipment: 'None',
          exerciseId: 'plank-001',
          images: [],
        },
      });

      const exercise = await ExerciseService.getExerciseById(seededExercise.id);

      expect(exercise).toBeDefined();
      expect(exercise).toMatchObject({
        name: 'Plank',
        category: ExerciseType.STRENGTH,
        primaryMuscles: ['Core'],
        level: Difficulty.INTERMEDIATE,
        equipment: 'None',
      });
    });

    it('should return null for non-existing exercise ID', async () => {
      const exercise = await ExerciseService.getExerciseById(9999); // Assuming this ID doesn't exist
      expect(exercise).toBeNull();
    });
  });

  describe('getMuscleGroups', () => {
    it('should retrieve distinct muscle groups', async () => {
      // Seed some exercises
      await testPrisma.exercise.createMany({
        data: [
          {
            name: 'Bicep Curl',
            category: ExerciseType.STRENGTH,
            primaryMuscles: ['Biceps'],
            level: Difficulty.BEGINNER,
            equipment: 'Dumbbell',
            exerciseId: 'bicep-curl-001',
            images: [],
          },
          {
            name: 'Tricep Dip',
            category: ExerciseType.STRENGTH,
            primaryMuscles: ['Triceps'],
            level: Difficulty.BEGINNER,
            equipment: 'Bench',
            exerciseId: 'tricep-dip-001',
            images: [],
          },
          {
            name: 'Hammer Curl',
            category: ExerciseType.STRENGTH,
            primaryMuscles: ['Biceps'],
            level: Difficulty.INTERMEDIATE,
            equipment: 'Dumbbell',
            exerciseId: 'hammer-curl-001',
            images: [],
          },
        ],
      });
      const muscles = await ExerciseService.getMuscleGroups();
      expect(muscles.sort()).toEqual(['Biceps', 'Triceps'].sort());
    });
  });

  describe('getEquipmentTypes', () => {
    it('should retrieve distinct equipment types', async () => {
      // Seed some exercises
      await testPrisma.exercise.createMany({
        data: [
          {
            name: 'Bicep Curl',
            category: ExerciseType.STRENGTH,
            primaryMuscles: ['Biceps'],
            level: Difficulty.BEGINNER,
            equipment: 'Dumbbell',
            exerciseId: 'bicep-curl-001',
            images: [],
          },
          {
            name: 'Tricep Dip',
            category: ExerciseType.STRENGTH,
            primaryMuscles: ['Triceps'],
            level: Difficulty.BEGINNER,
            equipment: 'Bench',
            exerciseId: 'tricep-dip-001',
            images: [],
          },
          {
            name: 'Running',
            category: ExerciseType.CARDIO,
            primaryMuscles: ['Legs'],
            level: Difficulty.INTERMEDIATE,
            equipment: 'Shoes',
            exerciseId: 'running-001',
            images: [],
          },
        ],
      });
      const equipmentTypes = await ExerciseService.getEquipmentTypes();
      expect(equipmentTypes.sort()).toEqual(['Dumbbell', 'Bench', 'Shoes'].sort());
    });
  });

  describe('getFilterOptions', () => {
    it('should retrieve filter options for exercises', async () => {
      // Seed some exercises
      await testPrisma.exercise.createMany({
        data: [
          {
            name: 'Lunges',
            category: ExerciseType.STRENGTH,
            primaryMuscles: ['Legs'],
            level: Difficulty.BEGINNER,
            equipment: 'None',
            exerciseId: 'lunges-001',
            images: [],
          },
          {
            name: 'Cycling',
            category: ExerciseType.CARDIO,
            primaryMuscles: ['Legs'],
            level: Difficulty.INTERMEDIATE,
            equipment: 'Bicycle',
            exerciseId: 'cycling-001',
            images: [],
          },
          {
            name: 'Yoga',
            category: ExerciseType.MOBILITY,
            primaryMuscles: ['Full Body'],
            level: Difficulty.BEGINNER,
            equipment: 'Mat',
            exerciseId: 'yoga-001',
            images: [],
          },
        ],
      });

      const filterOptions = await ExerciseService.getFilterOptions();

      expect(filterOptions).toMatchObject({
        categories: expect.arrayContaining(['STRENGTH', 'CARDIO', 'MOBILITY']),
        levels: expect.arrayContaining(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
        equipmentTypes: expect.arrayContaining(['None', 'Bicycle', 'Mat']),
        muscleGroups: expect.arrayContaining(['Legs', 'Full Body']),
        forceTypes: expect.any(Array),
        mechanicTypes: expect.any(Array),
      });
    });
  });

  describe('getExerciseList', () => {
    it('should retrieve exercise IDs and names', async () => {
      // Seed some exercises
      await testPrisma.exercise.createMany({
        data: [
          {
            name: 'Deadlift',
            category: ExerciseType.STRENGTH,
            primaryMuscles: ['Back'],
            level: Difficulty.ADVANCED,
            equipment: 'Barbell',
            exerciseId: 'deadlift-001',
            images: [],
          },
          {
            name: 'Burpees',
            category: ExerciseType.CARDIO,
            primaryMuscles: ['Full Body'],
            level: Difficulty.INTERMEDIATE,
            equipment: 'None',
            exerciseId: 'burpees-001',
            images: [],
          },
        ],
      });

      const exerciseList = await ExerciseService.getExerciseList();

      expect(exerciseList).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'Deadlift' }),
          expect.objectContaining({ name: 'Burpees' }),
        ])
      );
    });
  });
});
