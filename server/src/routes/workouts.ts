/* eslint-disable @typescript-eslint/no-misused-promises, @typescript-eslint/unbound-method */

import { Router, type Router as ExpressRouter } from 'express';
import { WorkoutController } from '@controllers/workoutController';
import { authenticateToken } from '@middleware/auth';

const router: ExpressRouter = Router();
/**
 * @swagger
 * /api/workouts:
 *   post:
 *     summary: Create a new workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               routineId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the routine to base workout on (optional)
 *               title:
 *                 type: string
 *                 maxLength: 140
 *                 description: Custom title for the workout
 *               visibility:
 *                 type: string
 *                 enum: [PRIVATE, PUBLIC, UNLISTED]
 *                 description: Workout visibility
 *     responses:
 *       201:
 *         description: Workout created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Authentication required
 */
router.post('/', authenticateToken, WorkoutController.createWorkout);

/**
 * @swagger
 * /api/workouts:
 *   get:
 *     summary: Get user's workouts
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of workouts to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of workouts to skip
 *       - in: query
 *         name: includeFinished
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Include finished workouts
 *       - in: query
 *         name: routineId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by routine ID
 *     responses:
 *       200:
 *         description: Workouts retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get('/', authenticateToken, WorkoutController.getUserWorkouts);

/**
 * @swagger
 * /api/workouts/stats:
 *   get:
 *     summary: Get workout statistics
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Workout statistics retrieved successfully
 *       401:
 *         description: Authentication required
 */
router.get('/stats', authenticateToken, WorkoutController.getWorkoutStats);

/**
 * @swagger
 * /api/workouts/analytics:
 *   get:
 *     summary: Get workout analytics for charts
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [overall-progress, muscle-groups, volume-over-time]
 *         description: Type of analytics to retrieve
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           default: 6
 *         description: Number of months to include in analytics
 *     responses:
 *       200:
 *         description: Workout analytics retrieved successfully
 *       400:
 *         description: Invalid analytics type
 *       401:
 *         description: Authentication required
 */
router.get('/analytics', authenticateToken, WorkoutController.getWorkoutAnalytics);

/**
 * @swagger
 * /api/workouts/{id}:
 *   get:
 *     summary: Get workout by ID
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Workout retrieved successfully
 *       404:
 *         description: Workout not found
 */
router.get('/:id', authenticateToken, WorkoutController.getWorkoutById);

/**
 * @swagger
 * /api/workouts/{id}:
 *   put:
 *     summary: Update workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 140
 *               visibility:
 *                 type: string
 *                 enum: [PRIVATE, PUBLIC, UNLISTED]
 *               finishedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Timestamp when workout was finished
 *     responses:
 *       200:
 *         description: Workout updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Workout not found
 */
router.put('/:id', authenticateToken, WorkoutController.updateWorkout);

/**
 * @swagger
 * /api/workouts/{id}:
 *   delete:
 *     summary: Delete workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Workout deleted successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Workout not found
 */
router.delete('/:id', authenticateToken, WorkoutController.deleteWorkout);

/**
 * @swagger
 * /api/workouts/{id}/finish:
 *   post:
 *     summary: Finish workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Workout finished successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Workout not found
 */
router.post('/:id/finish', authenticateToken, WorkoutController.finishWorkout);

/**
 * @swagger
 * /api/workouts/{id}/sets:
 *   post:
 *     summary: Add workout set
 *     tags: [Workout Sets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Workout ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exerciseId
 *             properties:
 *               exerciseId:
 *                 type: integer
 *                 description: Exercise ID
 *               setNumber:
 *                 type: integer
 *                 description: Set number (auto-incremented if not provided)
 *               reps:
 *                 type: integer
 *                 description: Number of repetitions
 *               weightKg:
 *                 type: number
 *                 format: float
 *                 description: Weight in kilograms
 *               rpe:
 *                 type: number
 *                 format: float
 *                 minimum: 1
 *                 maximum: 10
 *                 description: Rate of Perceived Exertion (1-10)
 *               durationSec:
 *                 type: integer
 *                 description: Duration in seconds
 *               notes:
 *                 type: string
 *                 description: Notes about the set
 *     responses:
 *       201:
 *         description: Workout set added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Workout not found
 */
router.post('/:id/sets', authenticateToken, WorkoutController.addWorkoutSet);

/**
 * @swagger
 * /api/workouts/sets/{setId}:
 *   put:
 *     summary: Update workout set
 *     tags: [Workout Sets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: setId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Workout set ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reps:
 *                 type: integer
 *                 description: Number of repetitions
 *               weightKg:
 *                 type: number
 *                 format: float
 *                 description: Weight in kilograms
 *               rpe:
 *                 type: number
 *                 format: float
 *                 minimum: 1
 *                 maximum: 10
 *                 description: Rate of Perceived Exertion (1-10)
 *               durationSec:
 *                 type: integer
 *                 description: Duration in seconds
 *               notes:
 *                 type: string
 *                 description: Notes about the set
 *     responses:
 *       200:
 *         description: Workout set updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Workout set not found
 */
router.put('/sets/:setId', authenticateToken, WorkoutController.updateWorkoutSet);

/**
 * @swagger
 * /api/workouts/sets/{setId}:
 *   delete:
 *     summary: Delete workout set
 *     tags: [Workout Sets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: setId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Workout set ID
 *     responses:
 *       200:
 *         description: Workout set deleted successfully
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Workout set not found
 */
router.delete('/sets/:setId', authenticateToken, WorkoutController.deleteWorkoutSet);

/**
 * @swagger
 * /api/workouts/{id}/sets/by-exercise:
 *   delete:
 *     summary: Delete workout set by exercise and set number
 *     description: Delete a specific set by exercise ID/name and set number
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Workout ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - setNumber
 *             properties:
 *               exerciseId:
 *                 type: integer
 *                 description: Database exercise ID (required if not custom exercise)
 *               customExerciseName:
 *                 type: string
 *                 description: Custom exercise name (required if custom exercise)
 *               setNumber:
 *                 type: string
 *                 description: Set number to delete
 *     responses:
 *       200:
 *         description: Workout set deleted successfully
 *       400:
 *         description: Invalid request or cannot delete last set
 *       401:
 *         description: Authentication required
 *       404:
 *         description: Workout or set not found
 */
router.delete(
  '/:id/sets/by-exercise',
  authenticateToken,
  WorkoutController.deleteWorkoutSetByExercise
);

export { router as workoutRoutes };
