/* eslint-disable @typescript-eslint/no-misused-promises, @typescript-eslint/unbound-method */

import { Router, type Router as ExpressRouter } from 'express';
import { ExerciseController } from '@/controllers/exerciseController';

const router: ExpressRouter = Router();

/**
 * @swagger
 * /api/exercises:
 *   get:
 *     summary: Search and filter exercises
 *     description: |
 *       Search exercises with multiple filter options:
 *       - Text search (searches name, instructions, muscles)
 *       - Filter by category (strength, cardio, mobility)
 *       - Filter by difficulty level (beginner, intermediate, advanced)
 *       - Filter by muscle groups (from primaryMuscles array)
 *       - Filter by equipment type
 *       - Filter by force type (push, pull, static)
 *       - Filter by mechanic (compound, isolation)
 *       - Pagination support
 *     tags: [Exercises]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for exercise name, instructions, or muscles
 *         example: "chest push"
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [STRENGTH, CARDIO, MOBILITY]
 *         description: Exercise category filter
 *         example: "STRENGTH"
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [BEGINNER, INTERMEDIATE, ADVANCED]
 *         description: Difficulty level filter
 *         example: "BEGINNER"
 *       - in: query
 *         name: primaryMuscles
 *         schema:
 *           type: string
 *         description: Target muscle group (searches in primaryMuscles array)
 *         example: "chest"
 *       - in: query
 *         name: equipment
 *         schema:
 *           type: string
 *         description: Equipment type filter
 *         example: "barbell"
 *       - in: query
 *         name: force
 *         schema:
 *           type: string
 *           enum: [PUSH, PULL, STATIC]
 *         description: Force type filter
 *         example: "PUSH"
 *       - in: query
 *         name: mechanic
 *         schema:
 *           type: string
 *           enum: [COMPOUND, ISOLATION]
 *         description: Movement mechanic filter
 *         example: "COMPOUND"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Number of exercises per page
 *         example: 18
 *     responses:
 *       200:
 *         description: Filtered list of exercises
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Exercise'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Invalid filter parameters
 *       500:
 *         description: Server error
 */
router.get('/', ExerciseController.searchExercises);

/**
 * @swagger
 * /api/exercises/random:
 *   get:
 *     summary: Get random exercises
 *     description: Fetches random exercises for discovery/exploration
 *     tags: [Exercises]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *         description: Number of exercises per page
 *         example: 18
 *     responses:
 *       200:
 *         description: Random list of exercises
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Exercise'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/random', ExerciseController.getRandomExercises);

/**
 * @swagger
 * /api/exercises/muscle-groups:
 *   get:
 *     summary: Get all available muscle groups
 *     description: Returns a list of all unique muscle groups for filtering
 *     tags: [Exercises]
 *     responses:
 *       200:
 *         description: List of muscle groups
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["chest", "back", "shoulders", "biceps", "triceps"]
 */
router.get('/muscle-groups', ExerciseController.getMuscleGroups);

/**
 * @swagger
 * /api/exercises/equipment-types:
 *   get:
 *     summary: Get all available equipment types
 *     description: Returns a list of all unique equipment types for filtering
 *     tags: [Exercises]
 *     responses:
 *       200:
 *         description: List of equipment types
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["barbell", "dumbbell", "body only", "cable", "machine"]
 */
router.get('/equipment-types', ExerciseController.getEquipmentTypes);

/**
 * @swagger
 * /api/exercises/filter-options:
 *   get:
 *     summary: Get all available filter options
 *     description: Returns all available filter options for the frontend to build dynamic filters
 *     tags: [Exercises]
 *     responses:
 *       200:
 *         description: All filter options
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["STRENGTH", "CARDIO", "MOBILITY"]
 *                     levels:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["BEGINNER", "INTERMEDIATE", "ADVANCED"]
 *                     muscleGroups:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["chest", "back", "shoulders"]
 *                     equipmentTypes:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["barbell", "dumbbell", "body only"]
 *                     forceTypes:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["PUSH", "PULL", "STATIC"]
 *                     mechanicTypes:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["COMPOUND", "ISOLATION"]
 */
router.get('/filter-options', ExerciseController.getFilterOptions);

/**
 * @swagger
 * /api/exercises/list:
 *   get:
 *     summary: Get exercise list
 *     description: Get a simple list of all exercises with just ID and name (useful for routine creation)
 *     tags: [Exercises]
 *     responses:
 *       200:
 *         description: Exercise list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Bench Press"
 */
router.get('/list', ExerciseController.getExerciseList);

/**
 * @swagger
 * /api/exercises/{id}:
 *   get:
 *     summary: Get exercise by ID
 *     description: Retrieve detailed information about a specific exercise
 *     tags: [Exercises]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Exercise ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Exercise details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Exercise'
 *       404:
 *         description: Exercise not found
 *       400:
 *         description: Invalid exercise ID
 */
router.get('/:id', ExerciseController.getExerciseById);

export { router as exerciseRoutes };
