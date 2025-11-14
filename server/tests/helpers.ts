import request from 'supertest';
import { Server } from '../src/app';
import { testPrisma } from './setup';
import { CreateUserRequest } from '../src/types';

// Test app instance
export const testApp = new Server().getApp();

// Test utilities
export const testRequest = request(testApp);

// Helper functions for creating test data
export const createTestUser = async (userData?: Partial<CreateUserRequest>) => {
  const defaultUser: CreateUserRequest = {
    username: 'testuser',
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    ...userData,
  };

  return await testPrisma.user.create({
    data: {
      ...defaultUser,
      passwordHash: 'hashed_password_for_testing', // We'll mock bcrypt in tests
    },
  });
};

export const createTestExercise = async (exerciseData?: any) => {
  const defaultExercise = {
    name: 'Test Exercise',
    equipment: 'Barbell',
    muscle: 'Chest',
    type: 'STRENGTH',
    ...exerciseData,
  };

  return await testPrisma.exercise.create({
    data: defaultExercise,
  });
};

export const createTestRoutine = async (authorId: string, routineData?: any) => {
  const defaultRoutine = {
    title: 'Test Routine',
    description: 'A test workout routine',
    difficulty: 'BEGINNER',
    visibility: 'PRIVATE',
    ...routineData,
  };

  return await testPrisma.routine.create({
    data: {
      ...defaultRoutine,
      authorId,
    },
  });
};

// Authentication helpers
export const loginTestUser = async (
  email: string = 'test@example.com',
  password: string = 'password123'
) => {
  const response = await testRequest.post('/api/auth/login').send({ email, password });

  return response.body.token;
};

export const createAuthenticatedUser = async (userData?: Partial<CreateUserRequest>) => {
  const response = await testRequest.post('/api/auth/register').send({
    username: 'testuser',
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    ...userData,
  });

  return {
    user: response.body.user,
    token: response.body.token,
  };
};

// Database cleanup helpers
export const cleanupDatabase = async () => {
  await testPrisma.workoutSet.deleteMany({});
  await testPrisma.workout.deleteMany({});
  await testPrisma.routineVote.deleteMany({});
  await testPrisma.routineExercise.deleteMany({});
  await testPrisma.routine.deleteMany({});
  await testPrisma.exercise.deleteMany({});
  await testPrisma.user.deleteMany({});
};

// Mock data generators
export const generateUsers = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    username: `user${i}`,
    fullName: `User ${i}`,
    email: `user${i}@example.com`,
    password: 'password123',
  }));
};

export const generateExercises = (count: number) => {
  const exercises = ['Push-up', 'Pull-up', 'Squat', 'Deadlift', 'Bench Press'];
  const equipment = ['Bodyweight', 'Barbell', 'Dumbbell', 'Machine'];
  const muscles = ['Chest', 'Back', 'Legs', 'Arms', 'Core'];

  return Array.from({ length: count }, (_, i) => ({
    name: exercises[i % exercises.length] + ` ${i}`,
    equipment: equipment[i % equipment.length],
    muscle: muscles[i % muscles.length],
    type: 'STRENGTH',
  }));
};
