import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local in development
// and .env in production (standard naming)
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
config({ path: resolve(process.cwd(), envFile) });

import { Server } from './app';
import { logger } from '@utils/logger';

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server
try {
  const server = new Server();
  server.start();
} catch (error) {
  logger.error('Failed to start server:', error);
  process.exit(1);
}
