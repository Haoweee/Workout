import { Request, Response } from 'express';
import { WorkoutService } from '@services/workoutService';
import {
  AddWorkoutSetRequest,
  CreateWorkoutRequest,
  UpdateWorkoutRequest,
  UpdateWorkoutSet,
} from '@/types';
import { logger } from '@utils/logger';

export class WorkoutController {
  /**
   * Create a new workout
   */
  static createWorkout = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { routineId, title, visibility, dayIndex } = req.body as CreateWorkoutRequest;

      if (
        typeof routineId !== 'string' ||
        typeof title !== 'string' ||
        typeof visibility !== 'string' ||
        typeof dayIndex !== 'number'
      ) {
        res.status(400).json({ error: 'Missing or invalid workout input fields' });
        return;
      }

      const workout = await WorkoutService.createWorkout(userId, {
        routineId,
        title,
        visibility,
        dayIndex,
      });

      res.status(201).json({
        message: 'Workout created successfully',
        data: workout,
      });
    } catch (error) {
      logger.error('Error creating workout:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Failed to create workout',
      });
    }
  };

  /**
   * Get user's workouts (for listing workouts in a table)
   */
  static getUserWorkouts = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { limit = '20', offset = '0', includeFinished = 'true', routineId } = req.query;

      const result = await WorkoutService.getUserWorkouts(userId, {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        includeFinished: (includeFinished as string).toLowerCase() === 'true',
        routineId: routineId as string,
      });

      res.json({
        message: 'Workouts retrieved successfully',
        data: result.workouts,
        pagination: {
          total: result.total,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          hasMore: result.total > parseInt(offset as string) + parseInt(limit as string),
        },
      });
    } catch (error) {
      logger.error('Error fetching user workouts:', error);
      res.status(500).json({
        error: 'Failed to fetch workouts',
      });
    }
  };

  /**
   * Get workout by ID (on active workout page)
   */
  static getWorkoutById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      logger.info(`Fetching workout ${id} for user ${userId}`);

      if (!userId) {
        logger.warn('No userId found in request');
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const workout = await WorkoutService.getWorkoutById(id!, userId);

      if (!workout) {
        logger.warn(`Workout ${id} not found or access denied for user ${userId}`);
        res.status(404).json({ error: 'Workout not found' });
        return;
      }

      logger.info(`Successfully retrieved workout ${id} for user ${userId}`);
      res.json({
        message: 'Workout retrieved successfully',
        data: workout,
      });
    } catch (error) {
      logger.error('Error fetching workout:', error);
      res.status(500).json({
        error: 'Failed to fetch workout',
      });
    }
  };

  /**
   * Update workout
   */
  static updateWorkout = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { title, visibility, finishedAt } = req.body as UpdateWorkoutRequest;

      const updateData: Partial<UpdateWorkoutRequest> = {};
      if (title !== undefined) updateData.title = title;
      if (visibility !== undefined) updateData.visibility = visibility;
      if (finishedAt !== undefined)
        updateData.finishedAt = finishedAt ? new Date(finishedAt) : null;

      const workout = await WorkoutService.updateWorkout(id!, userId, updateData);

      res.json({
        message: 'Workout updated successfully',
        data: workout,
      });
    } catch (error) {
      logger.error('Error updating workout:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Failed to update workout',
      });
    }
  };

  /**
   * Delete workout
   */
  static deleteWorkout = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      await WorkoutService.deleteWorkout(id!, userId);

      res.json({
        message: 'Workout deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting workout:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Failed to delete workout',
      });
    }
  };

  /**
   * Finish workout
   */
  static finishWorkout = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const workout = await WorkoutService.finishWorkout(id!, userId);

      res.json({
        message: 'Workout finished successfully',
        data: workout,
      });
    } catch (error) {
      logger.error('Error finishing workout:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Failed to finish workout',
      });
    }
  };

  /**
   * Add workout set
   */
  static addWorkoutSet = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params; // workout id
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const {
        exerciseId,
        customExerciseName,
        customExerciseCategory,
        customExercisePrimaryMuscles,
        setNumber,
        reps,
        weightKg,
        rpe,
        durationSec,
        notes,
      } = req.body as AddWorkoutSetRequest;

      // Build the workout set data, excluding undefined values to satisfy exactOptionalPropertyTypes
      const workoutSetData = {
        exerciseId,
        setNumber,
        ...(reps !== undefined && { reps }),
        ...(weightKg !== undefined && { weightKg }),
        ...(customExerciseName !== undefined && { customExerciseName }),
        ...(customExerciseCategory !== undefined && { customExerciseCategory }),
        ...(customExercisePrimaryMuscles !== undefined && { customExercisePrimaryMuscles }),
        ...(rpe !== undefined && { rpe }),
        ...(durationSec !== undefined && { durationSec }),
        ...(notes !== undefined && { notes }),
      };

      const workoutSet = await WorkoutService.addWorkoutSet(id!, userId, workoutSetData);

      res.status(201).json({
        message: 'Workout set added successfully',
        data: workoutSet,
      });
    } catch (error) {
      logger.error('Error adding workout set:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Failed to add workout set',
      });
    }
  };

  /**
   * Update workout set
   */
  static updateWorkoutSet = async (req: Request, res: Response): Promise<void> => {
    try {
      const { setId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { reps, weightKg, rpe, durationSec, notes } = req.body as UpdateWorkoutSet;

      // Build the update data, excluding undefined values to satisfy exactOptionalPropertyTypes
      const updateData = {
        ...(reps !== undefined && { reps }),
        ...(weightKg !== undefined && { weightKg }),
        ...(rpe !== undefined && { rpe }),
        ...(durationSec !== undefined && { durationSec }),
        ...(notes !== undefined && { notes }),
      };

      const workoutSet = await WorkoutService.updateWorkoutSet(setId!, userId, updateData);

      res.json({
        message: 'Workout set updated successfully',
        data: workoutSet,
      });
    } catch (error) {
      logger.error('Error updating workout set:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Failed to update workout set',
      });
    }
  };

  /**
   * Delete workout set
   */
  static deleteWorkoutSet = async (req: Request, res: Response): Promise<void> => {
    try {
      const { setId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      await WorkoutService.deleteWorkoutSet(setId!, userId);

      res.json({
        message: 'Workout set deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting workout set:', error);
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Failed to delete workout set',
      });
    }
  };

  /**
   * Get workout statistics
   */
  static getWorkoutStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const stats = await WorkoutService.getWorkoutStats(userId);

      res.json({
        message: 'Workout statistics retrieved successfully',
        data: stats,
      });
    } catch (error) {
      logger.error('Error fetching workout stats:', error);
      res.status(500).json({
        error: 'Failed to fetch workout statistics',
      });
    }
  };

  /**
   * Get workout analytics for charts
   */
  static getWorkoutAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const { type, weeks = '6' } = req.query;
      const weeksToFetch = parseInt(weeks as string);

      let analytics;

      switch (type) {
        case 'overall-progress':
          analytics = await WorkoutService.getOverallProgressAnalytics(userId, weeksToFetch);
          break;
        case 'muscle-groups':
          analytics = await WorkoutService.getMuscleGroupAnalytics(userId, weeksToFetch);
          logger.info(`Muscle group analytics for user ${userId}:`, analytics);
          break;
        case 'volume-over-time':
          analytics = await WorkoutService.getVolumeOverTimeAnalytics(userId, weeksToFetch);
          break;
        default:
          res.status(400).json({ error: 'Invalid analytics type' });
          return;
      }

      res.json({
        message: 'Workout analytics retrieved successfully',
        data: analytics,
      });
    } catch (error) {
      logger.error('Error fetching workout analytics:', error);
      res.status(500).json({
        error: 'Failed to fetch workout analytics',
      });
    }
  };
}
