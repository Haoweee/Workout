import { Request, Response, NextFunction } from 'express';
import {
  UpdateProfileRequest,
  ApiResponse,
  UserProfile,
  UserProfileUpdate,
  UserAnalytics,
  PaginatedResponse,
} from '@/types';
import { UserService } from '@/services/userService';
import { logger } from '@/utils/logger';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
    // Use synchronous mkdir or ensure directory exists beforehand
    fs.mkdir(uploadDir, { recursive: true })
      .then(() => cb(null, uploadDir))
      .catch((error: Error) => cb(error, uploadDir));
  },
  filename: (req, file, cb) => {
    const userId = req.user?.userId;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `user_${userId}_${timestamp}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export class UsersController {
  static async getUserProfile(
    req: Request,
    res: Response<ApiResponse<UserProfile>>,
    next: NextFunction
  ): Promise<void> {
    try {
      // userId is guaranteed to exist due to authenticateToken middleware
      const userId: string = req.user!.userId;

      const userProfile = await UserService.getUserById(userId);

      if (!userProfile) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: userProfile,
      });
    } catch (error) {
      logger.error('Get user profile error:', error);
      next(error);
    }
  }

  static async updateUserProfile(
    req: Request,
    res: Response<ApiResponse<UserProfileUpdate>>,
    next: NextFunction
  ): Promise<void> {
    try {
      // userId is guaranteed to exist due to authenticateToken middleware
      const userId: string = req.user!.userId;

      const updateData: UpdateProfileRequest = req.body as UpdateProfileRequest;
      const updatedUser = await UserService.updateProfile(userId, updateData);

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      logger.error('Update user profile error:', error);
      next(error);
    }
  }

  static async uploadAvatar(
    req: Request,
    res: Response<ApiResponse<UserProfile>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId: string = req.user!.userId;
      const file = req.file;

      if (!file) {
        res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
        return;
      }

      // Get current user to check for existing avatar
      const currentUser = await UserService.getUserById(userId);

      // Delete old avatar file if it exists
      if (currentUser?.avatarUrl) {
        try {
          const oldFilePath = path.join(process.cwd(), currentUser.avatarUrl);
          await fs.unlink(oldFilePath);
        } catch (error) {
          // Log but don't fail if old file can't be deleted
          logger.warn('Could not delete old avatar file:', error);
        }
      }

      // Create the avatar URL (relative path from public directory)
      const avatarUrl = `/uploads/avatars/${file.filename}`;

      // Update user's avatar URL in database
      const updatedUser = await UserService.updateAvatar(userId, avatarUrl);

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      logger.error('Upload avatar error:', error);
      next(error);
    }
  }

  static async getAllUsers(
    req: Request,
    res: Response<PaginatedResponse<UserProfile>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const query: string = (req.query.q as string) || '';
      const page: number = parseInt(req.query.page as string) || 1;
      const limit: number = parseInt(req.query.limit as string) || 10;

      const result = await UserService.searchUsers(query, page, limit);

      res.status(200).json({
        success: true,
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error('Get all users error:', error);
      next(error);
    }
  }

  static async getUserById(
    req: Request,
    res: Response<ApiResponse<UserProfile>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId: string | undefined = req.params.id;

      if (!userId) {
        res.status(400).json({
          success: false,
          error: 'User ID is required',
        });
        return;
      }

      const userProfile = await UserService.getUserById(userId);

      if (!userProfile) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: userProfile,
      });
    } catch (error) {
      logger.error('Get user by ID error:', error);
      next(error);
    }
  }

  static async getUserAnalytics(
    req: Request,
    res: Response<ApiResponse<UserAnalytics>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId: string = req.user!.userId;

      if (!userId) {
        res.status(400).json({
          success: false,
          error: 'User ID is required',
        });
        return;
      }

      const analytics = await UserService.getUserAnalytics(userId);

      if (!analytics) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      logger.error('Get user analytics error:', error);
      next(error);
    }
  }

  static async reactivateUser(
    req: Request,
    res: Response<ApiResponse<null>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId: string | undefined = req.params.id;

      if (!userId) {
        res.status(400).json({
          success: false,
          error: 'User ID is required',
        });
        return;
      }

      const reactivatedUser = await UserService.reactivateUser(userId);

      if (!reactivatedUser) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: null,
      });
    } catch (error) {
      logger.error('Reactivate user error:', error);
      next(error);
    }
  }

  static async deactivateUser(
    req: Request,
    res: Response<ApiResponse<null>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId: string | undefined = req.params.id;

      if (!userId) {
        res.status(400).json({
          success: false,
          error: 'User ID is required',
        });
        return;
      }

      const deactivatedUser = await UserService.deactivateUser(userId);

      if (!deactivatedUser) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: null,
      });
    } catch (error) {
      logger.error('Deactivate user error:', error);
      next(error);
    }
  }

  static async deleteUser(
    req: Request,
    res: Response<ApiResponse<null>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId: string | undefined = req.params.id;

      if (!userId) {
        res.status(400).json({
          success: false,
          error: 'User ID is required',
        });
        return;
      }

      const deletedUser = await UserService.deleteUser(userId);

      if (!deletedUser) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: null,
      });
    } catch (error) {
      logger.error('Delete user error:', error);
      next(error);
    }
  }
}
