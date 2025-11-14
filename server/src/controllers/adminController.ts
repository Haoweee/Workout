import { Request, Response, NextFunction } from 'express';
import { ApiResponse, StatsResponse } from '@/types';
import { FileCleanupService } from '@/services/fileCleanupService';
import { logger } from '@/utils/logger';

export class AdminController {
  /**
   * Manually trigger file cleanup
   */
  static async cleanupFiles(
    req: Request,
    res: Response<
      ApiResponse<{
        message: string;
        stats: StatsResponse;
      }>
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      logger.info('Manual file cleanup triggered by admin');

      await FileCleanupService.cleanupOrphanedAvatars();
      await FileCleanupService.cleanupOldAvatars(30);

      const stats = await FileCleanupService.getStorageStats();

      res.status(200).json({
        success: true,
        data: {
          message: 'File cleanup completed successfully',
          stats,
        },
      });
    } catch (error) {
      logger.error('Manual file cleanup error:', error);
      next(error);
    }
  }

  /**
   * Get storage statistics
   */
  static async getStorageStats(
    req: Request,
    res: Response<
      ApiResponse<{ totalFiles: number; totalSizeMB: number; averageFileSizeMB: number }>
    >,
    next: NextFunction
  ): Promise<void> {
    try {
      const stats = await FileCleanupService.getStorageStats();

      res.status(200).json({
        success: true,
        data: {
          ...stats,
          totalSizeMB: Math.round((stats.totalSize / (1024 * 1024)) * 100) / 100,
          averageFileSizeMB: Math.round((stats.averageFileSize / (1024 * 1024)) * 100) / 100,
        },
      });
    } catch (error) {
      logger.error('Get storage stats error:', error);
      next(error);
    }
  }
}
