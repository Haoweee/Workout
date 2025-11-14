# Testing Guide

This guide covers the comprehensive testing strategy for the Workout Backend Service, including unit tests, integration tests, and testing best practices.

---

## Overview

Our testing strategy ensures code quality, reliability, and maintainability through:

- **Unit Tests** - Testing individual functions and methods
- **Integration Tests** - Testing API endpoints and database interactions
- **Service Tests** - Testing business logic layer
- **Mock Strategy** - Isolated testing with controlled dependencies

**Testing Framework:** Jest
**Test Database:** PostgreSQL (separate test database)
**Coverage Target:** >80% overall coverage

---

## Test Architecture

### Test Structure

```
tests/
├── __mocks__/          # Mock implementations
├── unit/              # Unit tests
│   ├── authService.test.ts      # Authentication service tests
│   ├── exerciseService.test.ts  # Exercise service tests
│   ├── routineService.test.ts   # Routine service tests
│   ├── tokenService.test.ts     # Token service tests
│   ├── usersService.test.ts     # User service tests
│   └── workoutService.test.ts   # Workout service tests
├── integration/       # Integration tests
│   └── auth.test.ts   # Authentication endpoint tests
├── helpers.ts         # Test utilities
├── setup.ts          # Global test setup
├── testEnv.ts         # Test environment configuration
├── globalSetup.ts     # Jest global setup
└── globalTeardown.ts  # Jest global teardown
```

### Test Database Setup

The test suite uses a separate PostgreSQL database to ensure isolation:

```typescript
// tests/__mocks__/database.ts
import { PrismaClient } from "@prisma/client";

const testPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL || "postgresql://test:test@localhost:5432/workout_test",
    },
  },
  log: process.env.NODE_ENV === "test" ? [] : ["error"],
});

export { testPrisma };
```

---

## Test Configuration

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
    "^@services/(.*)$": "<rootDir>/src/services/$1",
    "^@middleware/(.*)$": "<rootDir>/src/middleware/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  globalSetup: "<rootDir>/tests/globalSetup.ts",
  globalTeardown: "<rootDir>/tests/globalTeardown.ts",
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/index.ts", "!src/scripts/**"],
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testTimeout: 30000,
  maxWorkers: 1, // Prevents database conflicts
};
```

### Environment Variables

```bash
# .env.test
NODE_ENV=test
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/workout_test
JWT_SECRET=test-jwt-secret
JWT_REFRESH_SECRET=test-refresh-secret
```

---

## Unit Tests

Unit tests focus on testing individual functions and methods in isolation.

### Service Layer Tests

```typescript
// tests/unit/services/routineService.test.ts
import { routineService } from "@/services/routineService";
import { testPrisma } from "../../__mocks__/database";

describe("RoutineService", () => {
  beforeEach(async () => {
    // Clean database before each test
    await testPrisma.routine.deleteMany();
    await testPrisma.user.deleteMany();
  });

  describe("createRoutine", () => {
    it("should create a routine with valid data", async () => {
      // Arrange
      const user = await testPrisma.user.create({
        data: {
          username: "testuser",
          email: "test@example.com",
          fullName: "Test User",
          passwordHash: "hashedpassword",
        },
      });

      const routineData = {
        title: "Test Routine",
        description: "A test routine",
        difficulty: "BEGINNER" as const,
        visibility: "PRIVATE" as const,
      };

      // Act
      const routine = await routineService.createRoutine(user.id, routineData);

      // Assert
      expect(routine).toBeDefined();
      expect(routine.title).toBe(routineData.title);
      expect(routine.authorId).toBe(user.id);
      expect(routine.difficulty).toBe("BEGINNER");
    });

    it("should throw error with invalid user ID", async () => {
      // Arrange
      const invalidUserId = "invalid-uuid";
      const routineData = {
        title: "Test Routine",
        description: "A test routine",
      };

      // Act & Assert
      await expect(routineService.createRoutine(invalidUserId, routineData)).rejects.toThrow();
    });
  });

  describe("getPublicRoutines", () => {
    it("should return public routines with pagination", async () => {
      // Arrange
      const user = await testPrisma.user.create({
        data: {
          username: "chi",
          email: "chi@example.com",
          fullName: "Chi User",
          passwordHash: "hashedpassword",
        },
      });

      await testPrisma.routine.createMany({
        data: [
          {
            authorId: user.id,
            title: "Public Routine 1",
            visibility: "PUBLIC",
          },
          {
            authorId: user.id,
            title: "Public Routine 2",
            visibility: "PUBLIC",
          },
          {
            authorId: user.id,
            title: "Private Routine",
            visibility: "PRIVATE",
          },
        ],
      });

      // Act
      const result = await routineService.getPublicRoutines();

      // Assert
      expect(result.routines).toHaveLength(2);
      expect(result.routines.every((r) => r.visibility === "PUBLIC")).toBe(true);
    });
  });
});
```

---

## Integration Tests

Integration tests verify that different components work together correctly, particularly API endpoints.

### API Endpoint Tests

```typescript
// tests/integration/auth.test.ts
import request from "supertest";
import { app } from "@/app";
import { testPrisma } from "../__mocks__/database";

describe("Auth Endpoints", () => {
  beforeEach(async () => {
    await testPrisma.user.deleteMany();
    await testPrisma.tokenBlacklist.deleteMany();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        fullName: "Test User",
        password: "password123",
      };

      const response = await request(app).post("/api/auth/register").send(userData).expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.passwordHash).toBeUndefined();
    });

    it("should reject duplicate email", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        fullName: "Test User",
        password: "password123",
      };

      // Create first user
      await request(app).post("/api/auth/register").send(userData).expect(201);

      // Attempt to create duplicate
      const response = await request(app)
        .post("/api/auth/register")
        .send({ ...userData, username: "differentuser" })
        .expect(409);

      expect(response.body.error).toContain("already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      // First register a user
      const userData = {
        username: "testuser",
        email: "test@example.com",
        fullName: "Test User",
        password: "password123",
      };

      await request(app).post("/api/auth/register").send(userData);

      // Then login
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
    });

    it("should reject invalid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body.error).toContain("Invalid credentials");
    });
  });
});
```

### Database Integration Tests

```typescript
// tests/integration/workouts.test.ts
import request from "supertest";
import { app } from "@/app";
import { testPrisma } from "../__mocks__/database";
import { createTestUser, createAuthToken } from "../helpers";

describe("Workout Endpoints", () => {
  let testUser: any;
  let authToken: string;

  beforeEach(async () => {
    await testPrisma.workoutSet.deleteMany();
    await testPrisma.workout.deleteMany();
    await testPrisma.routine.deleteMany();
    await testPrisma.user.deleteMany();

    testUser = await createTestUser();
    authToken = createAuthToken(testUser.id);
  });

  describe("POST /api/workouts", () => {
    it("should create a workout", async () => {
      const workoutData = {
        title: "Morning Workout",
        visibility: "PRIVATE",
      };

      const response = await request(app)
        .post("/api/workouts")
        .set("Authorization", `Bearer ${authToken}`)
        .send(workoutData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(workoutData.title);
      expect(response.body.data.userId).toBe(testUser.id);
    });

    it("should require authentication", async () => {
      await request(app).post("/api/workouts").send({ title: "Test Workout" }).expect(401);
    });
  });

  describe("GET /api/workouts", () => {
    it("should get user workouts", async () => {
      // Create test workouts
      await testPrisma.workout.createMany({
        data: [
          {
            userId: testUser.id,
            title: "Workout 1",
            visibility: "PRIVATE",
          },
          {
            userId: testUser.id,
            title: "Workout 2",
            visibility: "PRIVATE",
          },
        ],
      });

      const response = await request(app)
        .get("/api/workouts")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].userId).toBe(testUser.id);
    });

    it("should support pagination", async () => {
      // Create 5 test workouts
      const workouts = Array.from({ length: 5 }, (_, i) => ({
        userId: testUser.id,
        title: `Workout ${i + 1}`,
        visibility: "PRIVATE" as const,
      }));

      await testPrisma.workout.createMany({ data: workouts });

      const response = await request(app)
        .get("/api/workouts?limit=2&offset=0")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(2);
    });
  });
});
```

---

## Test Utilities

### Test Helpers

```typescript
// tests/helpers.ts
import jwt from "jsonwebtoken";
import { testPrisma } from "./__mocks__/database";

export const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    username: "testuser",
    email: "test@example.com",
    fullName: "Test User",
    passwordHash: "hashedpassword",
  };

  return await testPrisma.user.create({
    data: { ...defaultUser, ...overrides },
  });
};

export const createAuthToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "test-secret", { expiresIn: "1h" });
};

export const createTestRoutine = async (authorId: string, overrides = {}) => {
  const defaultRoutine = {
    authorId,
    title: "Test Routine",
    description: "A test routine",
    difficulty: "BEGINNER" as const,
    visibility: "PRIVATE" as const,
  };

  return await testPrisma.routine.create({
    data: { ...defaultRoutine, ...overrides },
  });
};

export const createTestExercise = async (overrides = {}) => {
  const defaultExercise = {
    name: "Test Exercise",
    category: "STRENGTH" as const,
    primaryMuscles: ["chest"],
    level: "BEGINNER" as const,
    instructions: "Test instructions",
  };

  return await testPrisma.exercise.create({
    data: { ...defaultExercise, ...overrides },
  });
};

export const cleanDatabase = async () => {
  const tablenames = await testPrisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tables = tablenames
    .map(({ tablename }) => tablename)
    .filter((name) => name !== "_prisma_migrations")
    .map((name) => `"public"."${name}"`)
    .join(", ");

  if (tables.length > 0) {
    await testPrisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
  }
};
```

### Mock Database Setup

```typescript
// tests/setup.ts
import { testPrisma } from "./__mocks__/database";
import { cleanDatabase } from "./helpers";

beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await testPrisma.$disconnect();
});

// Export testPrisma for use in test files
export { testPrisma };

// Global test utilities
declare global {
  var testDb: typeof testPrisma;
}

global.testDb = testPrisma;

// Mock console methods to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
};
```

---

## Testing Scripts

### Package.json Scripts

```json
{
  "scripts": {
    "test": "NODE_ENV=test jest --watchAll=false",
    "test:watch": "NODE_ENV=test jest --watch",
    "test:coverage": "NODE_ENV=test jest --coverage --watchAll=false",
    "test:ci": "NODE_ENV=test jest --ci --coverage --watchAll=false",
    "test:unit": "NODE_ENV=test jest tests/unit --watchAll=false",
    "test:integration": "NODE_ENV=test jest tests/integration --watchAll=false",
    "test:services": "NODE_ENV=test jest tests/unit/services --watchAll=false",
    "test:clear": "jest --clearCache"
  }
}
```

---

## Running Tests

### Local Development

```bash
# Run all tests
pnpm test

# Run with watch mode
pnpm test:watch

# Run specific test file
pnpm test routineService.test.ts

# Run tests with coverage
pnpm test:coverage

# Run only unit tests
pnpm test:unit

# Run only integration tests
pnpm test:integration
```

### CI/CD Environment

```bash
# CI test command (no watch, with coverage)
pnpm test:ci

# Set test database URL for CI
export TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/workout_test
```

---

## Test Coverage

### Coverage Reports

Jest generates coverage reports in multiple formats:

- **Terminal output** - Summary during test runs
- **HTML report** - Detailed coverage in `coverage/lcov-report/index.html`
- **LCOV format** - For CI integration

### Coverage Thresholds

```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  },
  './src/services/': {
    branches: 90,
    functions: 95,
    lines: 95,
    statements: 95
  }
}
```

---

## Mocking Strategies

### Database Mocking

```typescript
// Mock Prisma for unit tests
jest.mock("@/services/database", () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));
```

### External Service Mocking

```typescript
// Mock email service
jest.mock("@/services/emailService", () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

// Mock file upload
jest.mock("multer", () => ({
  diskStorage: jest.fn(),
  memoryStorage: jest.fn(),
}));
```

---

## Best Practices

### Test Organization

1. **Group related tests** using `describe` blocks
2. **Use descriptive test names** that explain the scenario
3. **Follow AAA pattern** (Arrange, Act, Assert)
4. **Keep tests independent** - each test should be able to run in isolation
5. **Clean up after tests** - reset database state between tests

### Test Data Management

```typescript
// Good: Create specific test data
const testUser = {
  username: "test_user_123",
  email: "test123@example.com",
  fullName: "Test User",
};

// Bad: Rely on existing data
const userId = "hardcoded-user-id";
```

### Error Testing

```typescript
// Test error conditions
it("should handle database connection errors", async () => {
  // Mock database error
  jest.spyOn(testPrisma.user, "create").mockRejectedValue(new Error("Database connection failed"));

  await expect(userService.createUser(userData)).rejects.toThrow("Database connection failed");
});
```

### Async Testing

```typescript
// Use async/await for async operations
it("should create user asynchronously", async () => {
  const user = await userService.createUser(userData);
  expect(user).toBeDefined();
});

// Test promise rejections
it("should reject invalid data", async () => {
  await expect(userService.createUser(invalidData)).rejects.toThrow("Invalid data");
});
```

---

## Debugging Tests

### Debug Configuration

```json
// .vscode/launch.json
{
  "configurations": [
    {
      "name": "Debug Jest Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "env": { "NODE_ENV": "test" },
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Test Debugging Tips

```bash
# Run single test file
pnpm test -- routineService.test.ts

# Run tests matching pattern
pnpm test -- --testNamePattern="should create routine"

# Debug with verbose output
pnpm test -- --verbose

# Run tests without coverage (faster)
pnpm test -- --coverage=false
```

---

## Performance Testing

### Database Performance

```typescript
// Test query performance
it("should retrieve workouts efficiently", async () => {
  const startTime = Date.now();

  const workouts = await workoutService.getUserWorkouts(userId);

  const duration = Date.now() - startTime;
  expect(duration).toBeLessThan(100); // Should complete in <100ms
});
```

### Memory Leak Testing

```typescript
// Monitor memory usage
beforeAll(() => {
  global.gc && global.gc();
  const initialMemory = process.memoryUsage().heapUsed;
  console.log(`Initial memory: ${initialMemory / 1024 / 1024} MB`);
});

afterAll(() => {
  global.gc && global.gc();
  const finalMemory = process.memoryUsage().heapUsed;
  console.log(`Final memory: ${finalMemory / 1024 / 1024} MB`);
});
```

---

## Continuous Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: workout_test
        options: --health-cmd pg_isready --health-interval 10s --health-timeout 5s --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Run database migrations
        run: npx prisma migrate deploy
        env:
          TEST_DATABASE_URL: postgresql://test:test@localhost:5432/workout_test

      - name: Run tests
        run: pnpm test:ci
        env:
          TEST_DATABASE_URL: postgresql://test:test@localhost:5432/workout_test

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

This comprehensive testing guide ensures robust, maintainable code with high confidence in functionality and reliability.
