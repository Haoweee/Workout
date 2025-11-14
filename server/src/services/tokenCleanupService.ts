import { TokenService } from '@services/tokenService';
import { logger } from '@utils/logger';

export class TokenCleanupService {
  private static cleanupInterval: NodeJS.Timeout | null = null;

  /**
   * Start automatic cleanup of expired blacklisted tokens
   * @param intervalMinutes How often to run cleanup (default: 60 minutes)
   */
  static startCleanup(intervalMinutes: number = 60): void {
    if (this.cleanupInterval) {
      logger.warn('Token cleanup service is already running');
      return;
    }

    const intervalMs = intervalMinutes * 60 * 1000;

    this.cleanupInterval = setInterval(() => {
      (async () => {
        try {
          logger.info('Starting token cleanup...');
          const deletedCount = await TokenService.cleanupExpiredTokens();
          logger.info(`Token cleanup completed. Removed ${deletedCount} expired tokens.`);
        } catch (error) {
          logger.error('Token cleanup failed:', error);
        }
      })().catch((error) => {
        logger.error('Unexpected error in token cleanup:', error);
      });
    }, intervalMs);

    logger.info(`Token cleanup service started. Running every ${intervalMinutes} minutes.`);
  }

  /**
   * Stop the automatic cleanup service
   */
  static stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      logger.info('Token cleanup service stopped');
    }
  }

  /**
   * Run cleanup manually
   */
  static async runCleanup(): Promise<number> {
    try {
      logger.info('Manual token cleanup started...');
      const deletedCount = await TokenService.cleanupExpiredTokens();
      logger.info(`Manual token cleanup completed. Removed ${deletedCount} expired tokens.`);
      return deletedCount;
    } catch (error) {
      logger.error('Manual token cleanup failed:', error);
      return 0;
    }
  }
}
