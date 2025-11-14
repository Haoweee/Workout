import { PrismaClient } from '@prisma/client';
import { logger } from '@/utils/logger';

class PrismaService {
  private static instance: PrismaService;
  public prisma: PrismaClient;

  private constructor() {
    // Use test database URL for testing
    const databaseUrl =
      process.env.NODE_ENV === 'test'
        ? 'postgresql://haowee:@localhost:5432/chi_test'
        : process.env.DATABASE_URL;

    this.prisma = new PrismaClient({
      ...(databaseUrl && {
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
      }),
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  public static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService();
    }
    return PrismaService.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      logger.info('✅ Connected to database');
    } catch (error) {
      logger.error('❌ Failed to connect to database:', error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      logger.info('✅ Disconnected from database');
    } catch (error) {
      logger.error('❌ Failed to disconnect from database:', error);
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error('Database health check failed:', error);
      return false;
    }
  }
}

export const prismaService = PrismaService.getInstance();
export const prisma = prismaService.prisma;
