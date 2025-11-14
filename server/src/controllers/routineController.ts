import { Request, Response, NextFunction } from 'express';
import { RoutineService } from '@/services/routineService';
import {
  CreateRoutineRequest,
  RoutineResponse,
  ApiResponse,
  PaginatedResponse,
  UpdateRoutineRequest,
  RoutineFilters,
  VoteRequest,
  PublicRoutineResponse,
  UserRoutineResponse,
  AddExerciseToRoutineRequest,
  Difficulty,
  SuggestedExercises,
} from '@/types';
import { logger } from '@/utils/logger';

export class RoutineController {
  static async createRoutine(
    req: Request,
    res: Response<ApiResponse<RoutineResponse>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const routineData = req.body as CreateRoutineRequest;
      const userId: string = req.user!.userId;
      const newRoutine: RoutineResponse = await RoutineService.createRoutine(userId, routineData);

      res.status(201).json({
        success: true,
        data: newRoutine,
      });
    } catch (error) {
      logger.error('Error creating routine:', error);
      next(error);
    }
  }

  static async getRoutineById(
    req: Request,
    res: Response<ApiResponse<RoutineResponse>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const routineId = req.params.id;

      if (!routineId) {
        res.status(400).json({
          success: false,
          error: 'Routine ID is required',
        });
        return;
      }

      const routine = await RoutineService.getRoutineById(routineId);

      if (!routine) {
        res.status(404).json({
          success: false,
          error: 'Routine not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: routine, // Cast to avoid type mismatch
      });
    } catch (error) {
      logger.error('Error fetching routine:', error);
      next(error);
    }
  }

  static async getPublicRoutines(
    req: Request,
    res: Response<PaginatedResponse<PublicRoutineResponse>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const filters: RoutineFilters = {
        difficulty: req.query.difficulty as Difficulty,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
        // Only include excludeUserId if user is authenticated
        ...(req.user?.userId && { excludeUserId: req.user.userId }),
      };

      const result = await RoutineService.getPublicRoutines(filters);

      res.status(200).json({
        success: true,
        data: result.routines,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error('Error fetching public routines:', error);
      next(error);
    }
  }

  static async getUserRoutines(
    req: Request,
    res: Response<ApiResponse<UserRoutineResponse[]>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId: string = req.user!.userId;
      const routines = await RoutineService.getUserRoutines(userId);

      res.status(200).json({
        success: true,
        data: routines,
      });
    } catch (error) {
      logger.error('Error fetching user routines:', error);
      next(error);
    }
  }

  static async updateRoutine(
    req: Request,
    res: Response<ApiResponse<RoutineResponse>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const routineId = req.params.id;
      const userId: string = req.user!.userId;
      const updates = req.body as UpdateRoutineRequest;

      if (!routineId) {
        res.status(400).json({
          success: false,
          error: 'Routine ID is required',
        });
        return;
      }

      const updatedRoutine = await RoutineService.updateRoutine(routineId, userId, updates);

      if (!updatedRoutine) {
        res.status(404).json({
          success: false,
          error: 'Routine not found or you do not have permission to update it',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedRoutine,
      });
    } catch (error) {
      logger.error('Error updating routine:', error);
      next(error);
    }
  }

  static async deleteRoutine(
    req: Request,
    res: Response<ApiResponse<null>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const routineId = req.params.id;
      const userId: string = req.user!.userId;

      if (!routineId) {
        res.status(400).json({
          success: false,
          error: 'Routine ID is required',
        });
        return;
      }

      await RoutineService.deleteRoutine(routineId, userId);

      res.status(200).json({
        success: true,
        data: null,
        message: 'Routine deleted successfully',
      });
    } catch (error) {
      if ((error as Error).message === 'Routine not found') {
        res.status(404).json({
          success: false,
          error: (error as Error).message,
        });
        return;
      }
      logger.error('Error deleting routine:', error);
      next(error);
    }
  }

  static async suggestedExercises(
    req: Request,
    res: Response<ApiResponse<SuggestedExercises[]>>,
    next: NextFunction
  ): Promise<void> {
    try {
      // Suggested exercises
      // [Bench Press, Squat, Deadlift, Overhead Press, Barbell Row, Pull-Up]
      const suggested_exercises = ['44', '48', '47', '59', '80', '560'];
      const suggestedExercises = await RoutineService.getExercisesByIds(suggested_exercises);

      res.status(200).json({
        success: true,
        data: suggestedExercises,
      });
    } catch (error) {
      logger.error('Error fetching suggested exercises:', error);
      next(error);
    }
  }

  static async addExerciseToRoutine(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const routineId = req.params.id;
      const userId: string = req.user!.userId;
      const exerciseData = req.body as AddExerciseToRoutineRequest;

      if (!routineId) {
        res.status(400).json({
          success: false,
          error: 'Routine ID is required',
        });
        return;
      }

      await RoutineService.addExerciseToRoutine(routineId, userId, exerciseData);

      // Fetch the updated routine to return a valid RoutineResponse
      const updatedRoutine = await RoutineService.getRoutineById(routineId);

      res.status(201).json({
        success: true,
        data: updatedRoutine,
        message: 'Exercise added to routine successfully',
      });
    } catch (error) {
      logger.error('Error adding exercise to routine:', error);
      next(error);
    }
  }

  static async removeExerciseFromRoutine(
    req: Request,
    res: Response<ApiResponse<null>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const routineExerciseId = req.params.exerciseId;
      const userId: string = req.user!.userId;

      if (!routineExerciseId) {
        res.status(400).json({
          success: false,
          error: 'Exercise ID is required',
        });
        return;
      }

      // Validate UUID format early
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(routineExerciseId)) {
        res.status(400).json({
          success: false,
          error: `Invalid exercise ID format. Expected UUID format like "123e4567-e89b-12d3-a456-426614174000", received: "${routineExerciseId}"`,
        });
        return;
      }

      await RoutineService.removeExerciseFromRoutine(routineExerciseId, userId);

      res.status(200).json({
        success: true,
        data: null,
        message: 'Exercise removed from routine successfully',
      });
    } catch (error) {
      if (
        (error as Error).message === 'Exercise not found in routine' ||
        (error as Error).message === 'You do not have permission to modify this routine' ||
        (error as Error).message.includes('Invalid routine exercise ID format')
      ) {
        res.status(404).json({
          success: false,
          error: (error as Error).message,
        });
        return;
      }
      logger.error('Error removing exercise from routine:', error);
      next(error);
    }
  }

  static async voteOnRoutine(
    req: Request,
    res: Response<ApiResponse<null>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const routineId = req.params.id;
      const userId: string = req.user!.userId;
      const { value } = req.body as VoteRequest;

      if (!routineId) {
        res.status(400).json({
          success: false,
          error: 'Routine ID is required',
        });
        return;
      }

      if (value !== 1 && value !== -1) {
        res.status(400).json({
          success: false,
          error: 'Vote value must be 1 (upvote) or -1 (downvote)',
        });
        return;
      }

      await RoutineService.voteOnRoutine(userId, routineId, value);

      res.status(200).json({
        success: true,
        data: null,
        message: 'Vote recorded successfully',
      });
    } catch (error) {
      logger.error('Error voting on routine:', error);
      next(error);
    }
  }

  static async removeVote(
    req: Request,
    res: Response<ApiResponse<null>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const routineId = req.params.id;
      const userId: string = req.user!.userId;

      if (!routineId) {
        res.status(400).json({
          success: false,
          error: 'Routine ID is required',
        });
        return;
      }

      await RoutineService.removeVote(userId, routineId);

      res.status(200).json({
        success: true,
        data: null,
        message: 'Vote removed successfully',
      });
    } catch (error) {
      logger.error('Error removing vote:', error);
      next(error);
    }
  }

  static async cloneRoutine(
    req: Request,
    res: Response<ApiResponse<RoutineResponse>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const routineId = req.params.id;
      const userId: string = req.user!.userId;
      const { title } = req.body as { title?: string };

      if (!routineId) {
        res.status(400).json({
          success: false,
          error: 'Routine ID is required',
        });
        return;
      }

      const clonedRoutine = await RoutineService.cloneRoutine(routineId, userId, title);

      res.status(201).json({
        success: true,
        data: clonedRoutine,
        message: 'Routine cloned successfully',
      });
    } catch (error) {
      logger.error('Error cloning routine:', error);
      next(error);
    }
  }
}
