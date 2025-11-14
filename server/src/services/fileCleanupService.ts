import fs from 'fs/promises';
import path from 'path';
import { prisma } from './database';
import { logger } from '@/utils/logger';

export class FileCleanupService {
  private static readonly UPLOADS_DIR = path.join(process.cwd(), 'uploads');
  private static readonly AVATARS_DIR = path.join(process.cwd(), 'uploads', 'avatars');

  /**
   * Remove orphaned files that exist in filesystem but not referenced in database
   */
  static async cleanupOrphanedAvatars(): Promise<void> {
    try {
      // Get all avatar files from filesystem
      const filesInDir = await fs.readdir(this.AVATARS_DIR);
      const avatarFiles = filesInDir.filter((file) => file.startsWith('user_'));

      // Get all avatar URLs from database
      const usersWithAvatars = await prisma.user.findMany({
        where: {
          avatarUrl: { not: null },
        },
        select: {
          avatarUrl: true,
        },
      });

      const referencedFiles = new Set(
        usersWithAvatars
          .map((user) => user.avatarUrl)
          .filter(Boolean)
          .map((url) => path.basename(url!))
      );

      // Delete files that exist in filesystem but not referenced in database
      const orphanedFiles = avatarFiles.filter((file) => !referencedFiles.has(file));

      for (const file of orphanedFiles) {
        try {
          await fs.unlink(path.join(this.AVATARS_DIR, file));
          logger.info(`Deleted orphaned avatar file: ${file}`);
        } catch (error) {
          logger.warn(`Could not delete orphaned file ${file}:`, error);
        }
      }

      logger.info(`Cleanup completed. Removed ${orphanedFiles.length} orphaned files.`);
    } catch (error) {
      logger.error('Error during avatar cleanup:', error);
    }
  }

  /**
   * Remove old avatar files based on age (older than specified days)
   */
  static async cleanupOldAvatars(olderThanDays: number = 30): Promise<void> {
    try {
      const filesInDir = await fs.readdir(this.AVATARS_DIR);
      const avatarFiles = filesInDir.filter((file) => file.startsWith('user_'));

      const cutoffTime = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;

      for (const file of avatarFiles) {
        const filePath = path.join(this.AVATARS_DIR, file);
        const stats = await fs.stat(filePath);

        if (stats.mtimeMs < cutoffTime) {
          // Check if file is still referenced in database
          const isReferenced = await prisma.user.findFirst({
            where: {
              avatarUrl: { endsWith: file },
            },
          });

          if (!isReferenced) {
            try {
              await fs.unlink(filePath);
              logger.info(`Deleted old unreferenced avatar file: ${file}`);
            } catch (error) {
              logger.warn(`Could not delete old file ${file}:`, error);
            }
          }
        }
      }
    } catch (error) {
      logger.error('Error during old avatar cleanup:', error);
    }
  }

  /**
   * Get storage statistics
   */
  static async getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    orphanedFiles: number;
    averageFileSize: number;
  }> {
    try {
      const filesInDir = await fs.readdir(this.AVATARS_DIR);
      const avatarFiles = filesInDir.filter((file) => file.startsWith('user_'));

      let totalSize = 0;
      for (const file of avatarFiles) {
        const filePath = path.join(this.AVATARS_DIR, file);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
      }

      // Count orphaned files
      const usersWithAvatars = await prisma.user.findMany({
        where: { avatarUrl: { not: null } },
        select: { avatarUrl: true },
      });

      const referencedFiles = new Set(
        usersWithAvatars
          .map((user) => user.avatarUrl)
          .filter(Boolean)
          .map((url) => path.basename(url!))
      );

      const orphanedFiles = avatarFiles.filter((file) => !referencedFiles.has(file));

      return {
        totalFiles: avatarFiles.length,
        totalSize,
        orphanedFiles: orphanedFiles.length,
        averageFileSize: avatarFiles.length > 0 ? totalSize / avatarFiles.length : 0,
      };
    } catch (error) {
      logger.error('Error getting storage stats:', error);
      return {
        totalFiles: 0,
        totalSize: 0,
        orphanedFiles: 0,
        averageFileSize: 0,
      };
    }
  }

  /**
   * Schedule periodic cleanup (call this in your server startup)
   */
  static scheduleCleanup(): void {
    // Run cleanup every day at 2 AM
    setInterval(
      () => {
        (async () => {
          logger.info('Starting scheduled file cleanup...');
          await this.cleanupOrphanedAvatars();
          await this.cleanupOldAvatars(30); // Remove unreferenced files older than 30 days
        })().catch((error) => {
          logger.error('Scheduled file cleanup failed:', error);
        });
      },
      24 * 60 * 60 * 1000
    ); // 24 hours

    logger.info('File cleanup scheduler initialized');
  }
}
