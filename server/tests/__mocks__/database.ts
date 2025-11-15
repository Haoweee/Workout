import { PrismaClient } from '@prisma/client';

// Test database instance - this will replace the real database module during tests
const testPrismaInstance = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://haowee:@localhost:5432/chi_test',
    },
  },
});

class MockPrismaService {
  private static instance: MockPrismaService;
  public prisma: PrismaClient;

  private constructor() {
    this.prisma = testPrismaInstance;
  }

  public static getInstance(): MockPrismaService {
    if (!MockPrismaService.instance) {
      MockPrismaService.instance = new MockPrismaService();
    }
    return MockPrismaService.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
    } catch (error) {
      // Silently handle connection errors in tests
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
    } catch (error) {
      // Silently handle disconnection errors in tests
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const prismaService = MockPrismaService.getInstance();
export const prisma = prismaService.prisma;
export const testPrisma = testPrismaInstance;
