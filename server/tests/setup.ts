// Import the test database from the mock
import { testPrisma } from './__mocks__/database';
import type { PrismaClient } from '@prisma/client';
import { cleanupAuthController } from '../src/controllers/authController';

// Setup function that runs before each test
beforeEach(async () => {
  // Clear OTP codes between tests
  cleanupAuthController();

  // Clean up database before each test
  const tablenames = await testPrisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }: { tablename: string }) => tablename)
    .filter((name: string) => name !== '_prisma_migrations')
    .map((name: string) => `"public"."${name}"`)
    .join(', ');

  try {
    if (tables.length > 0) {
      await testPrisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    }
  } catch (error) {
    // Silently handle cleanup errors
  }
});

// Cleanup after all tests
afterAll(async () => {
  cleanupAuthController(); // Clear any intervals and OTP codes
  await testPrisma.$disconnect();
});

// Export testPrisma for use in test files
export { testPrisma };

// Global test utilities
declare global {
  // Extend globalThis to include testDb
  // eslint-disable-next-line no-var
  var testDb: PrismaClient;
}

global.testDb = testPrisma;

// Mock console methods in tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Setup function that runs before each test
beforeEach(async () => {
  // Clean up database before each test
  const tablenames = await testPrisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }: { tablename: string }) => tablename)
    .filter((name: string) => name !== '_prisma_migrations')
    .map((name: string) => `"public"."${name}"`)
    .join(', ');

  try {
    if (tables.length > 0) {
      await testPrisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    }
  } catch (error) {
    console.warn('Error during database cleanup', error);
  }
});

// Cleanup after all tests
afterAll(async () => {
  await testPrisma.$disconnect();
});

// Global test utilities
declare global {
  // Extend globalThis to include testDb
  // eslint-disable-next-line no-var
  var testDb: PrismaClient;
}

global.testDb = testPrisma;

// Mock console methods in tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
