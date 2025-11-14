import { Request, Response, NextFunction } from 'express';
import { ExerciseService, ExerciseFilters } from '@/services/exerciseService';
import {
  ApiResponse,
  PaginatedResponse,
  LegacyExerciseResponse,
  ExerciseType,
  Difficulty,
  ExerciseResponse,
} from '@/types';
import { logger } from '@/utils/logger';

// Type guards for query parameters
function isValidExerciseType(value: unknown): value is ExerciseType {
  return (
    typeof value === 'string' &&
    (value === 'STRENGTH' || value === 'CARDIO' || value === 'MOBILITY')
  );
}

function isValidDifficulty(value: unknown): value is Difficulty {
  return (
    typeof value === 'string' &&
    (value === 'BEGINNER' || value === 'INTERMEDIATE' || value === 'ADVANCED')
  );
}

function parseStringParam(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export class ExerciseController {
  /**
   * Get all exercises with optional filters
   */
  static async searchExercises(
    req: Request,
    res: Response<PaginatedResponse<ExerciseResponse>>,
    next: NextFunction
  ): Promise<void> {
    try {
      // Parse query parameters safely
      const category = isValidExerciseType(req.query.category) ? req.query.category : undefined;
      const primaryMuscles = parseStringParam(req.query.primaryMuscles);
      const level = isValidDifficulty(req.query.level) ? req.query.level : undefined;
      const equipment = parseStringParam(req.query.equipment);
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 25;
      const search = parseStringParam(req.query.search) || '';

      // Build filters object with proper typing
      const filters: ExerciseFilters = { page, limit, search };
      if (category) filters.category = category;
      if (primaryMuscles) filters.primaryMuscles = primaryMuscles;
      if (level) filters.level = level;
      if (equipment) filters.equipment = equipment;

      const result = await ExerciseService.getAllExercises(filters);

      res.status(200).json({
        success: true,
        data: result.exercises,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error('Error fetching exercises:', error);
      next(error);
    }
  }

  /**
   * Get random exercises
   */
  static async getRandomExercises(
    req: Request,
    res: Response<PaginatedResponse<LegacyExerciseResponse>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 18;

      const result = await ExerciseService.getRandomExercises(page, limit);

      res.status(200).json({
        success: true,
        data: result.exercises,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error('Error fetching random exercises:', error);
      next(error);
    }
  }

  /**
   * Get exercise by ID
   */
  static async getExerciseById(
    req: Request,
    res: Response<ApiResponse<LegacyExerciseResponse>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const idParam = req.params.id;

      if (!idParam) {
        res.status(400).json({
          success: false,
          error: 'Exercise ID is required',
        });
        return;
      }

      const id = parseInt(idParam);

      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid exercise ID',
        });
        return;
      }

      const exercise = await ExerciseService.getExerciseById(id);

      if (!exercise) {
        res.status(404).json({
          success: false,
          error: 'Exercise not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: exercise,
      });
    } catch (error) {
      logger.error('Error fetching exercise by ID:', error);
      next(error);
    }
  }

  /**
   * Get muscle groups
   */
  static async getMuscleGroups(
    req: Request,
    res: Response<ApiResponse<string[]>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const muscles = await ExerciseService.getMuscleGroups();

      res.status(200).json({
        success: true,
        data: muscles,
      });
    } catch (error) {
      logger.error('Error fetching muscle groups:', error);
      next(error);
    }
  }

  /**
   * Get equipment types
   */
  static async getEquipmentTypes(
    req: Request,
    res: Response<ApiResponse<string[]>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const equipment = await ExerciseService.getEquipmentTypes();

      res.status(200).json({
        success: true,
        data: equipment,
      });
    } catch (error) {
      logger.error('Error fetching equipment types:', error);
      next(error);
    }
  }

  /**
   * Get all filter options for frontend
   */
  static async getFilterOptions(
    req: Request,
    res: Response<ApiResponse<Record<string, unknown>>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const filterOptions = await ExerciseService.getFilterOptions();

      res.status(200).json({
        success: true,
        data: filterOptions,
      });
    } catch (error) {
      logger.error('Error fetching filter options:', error);
      next(error);
    }
  }

  /**
   * Get exercise IDs and names for debugging/selection
   */
  static async getExerciseList(
    req: Request,
    res: Response<ApiResponse<{ id: number; name: string }[]>>,
    next: NextFunction
  ): Promise<void> {
    try {
      const exercises = await ExerciseService.getExerciseList();

      res.status(200).json({
        success: true,
        data: exercises,
      });
    } catch (error) {
      logger.error('Error fetching exercise list:', error);
      next(error);
    }
  }
}
