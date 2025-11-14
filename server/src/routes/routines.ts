/* eslint-disable @typescript-eslint/no-misused-promises, @typescript-eslint/unbound-method */

import { Router, type Router as ExpressRouter } from 'express';
import { RoutineController } from '@/controllers/routineController';
import { authenticateToken, optionalAuth } from '@/middleware/auth';

const router: ExpressRouter = Router();
/**
 * @swagger
 * /api/routines:
 *   post:
 *     summary: Create a new routine
 *     description: |
 *       Create a new workout routine. You can create it empty and add exercises later using POST /api/routines/{id}/exercises
 *
 *       **To create an empty routine, simply omit the exercises array:**
 *       ```json
 *       {
 *         "title": "My Push Workout",
 *         "description": "Upper body push exercises",
 *         "difficulty": "INTERMEDIATE",
 *         "visibility": "PRIVATE"
 *       }
 *       ```
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoutineRequest'
 *           examples:
 *             empty_routine:
 *               summary: Create empty routine
 *               description: Create a routine without exercises (recommended)
 *               value:
 *                 title: "My Push Workout"
 *                 description: "Upper body push exercises"
 *                 difficulty: "INTERMEDIATE"
 *                 visibility: "PRIVATE"
 *             routine_with_exercises:
 *               summary: Create routine with exercises
 *               description: Create a routine with exercises included (advanced)
 *               value:
 *                 title: "Basic Push Workout"
 *                 description: "Simple push exercises"
 *                 difficulty: "BEGINNER"
 *                 visibility: "PRIVATE"
 *                 exercises:
 *                   - exerciseId: 1
 *                     dayIndex: 0
 *                     orderIndex: 0
 *                     sets: 3
 *                     reps: 10
 *                     restSeconds: 60
 *                     notes: "Start light"
 *     responses:
 *       201:
 *         description: Routine created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/RoutineResponse'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateToken, RoutineController.createRoutine);

/**
 * @swagger
 * /api/routines/public:
 *   get:
 *     summary: Get public routines
 *     description: Get all public routines with pagination and filters
 *     tags: [Routines]
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *       - name: difficulty
 *         in: query
 *         schema:
 *           type: string
 *           enum: [BEGINNER, INTERMEDIATE, ADVANCED]
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Public routines retrieved successfully
 */
router.get('/public', optionalAuth, RoutineController.getPublicRoutines);

/**
 * @swagger
 * /api/routines/my:
 *   get:
 *     summary: Get user's routines
 *     description: |
 *       Get all routines created by the authenticated user, including complete exercise details.
 *
 *       **Returns:**
 *       - Complete routine information
 *       - All exercises in each routine (ordered by day and order)
 *       - Exercise details (name, equipment, muscles, etc.)
 *       - Usage statistics (_count data)
 *
 *       **Perfect for:**
 *       - Displaying user's workout library
 *       - Showing routine previews with exercise lists
 *       - Managing and editing existing routines
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User routines retrieved successfully
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
 *                         type: string
 *                         example: "routine-123"
 *                       title:
 *                         type: string
 *                         example: "Push/Pull/Legs Split"
 *                       description:
 *                         type: string
 *                         example: "3-day workout split"
 *                       difficulty:
 *                         type: string
 *                         enum: [BEGINNER, INTERMEDIATE, ADVANCED]
 *                         example: "INTERMEDIATE"
 *                       visibility:
 *                         type: string
 *                         enum: [PUBLIC, UNLISTED, PRIVATE]
 *                         example: "PRIVATE"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       routineExercises:
 *                         type: array
 *                         description: All exercises in the routine (ordered by day/order)
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "routine-exercise-456"
 *                               description: "Use this ID to remove the exercise"
 *                             dayIndex:
 *                               type: integer
 *                               example: 0
 *                               description: "Day of the routine (0=Monday, 1=Tuesday, etc.)"
 *                             orderIndex:
 *                               type: integer
 *                               example: 0
 *                               description: "Order within the day (0=first, 1=second, etc.)"
 *                             sets:
 *                               type: integer
 *                               example: 4
 *                             reps:
 *                               type: integer
 *                               example: 8
 *                             restSeconds:
 *                               type: integer
 *                               example: 90
 *                             notes:
 *                               type: string
 *                               example: "Focus on controlled movement"
 *                             exercise:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 1
 *                                 name:
 *                                   type: string
 *                                   example: "Bench Press"
 *                                 equipment:
 *                                   type: string
 *                                   example: "Barbell"
 *                                 primaryMuscles:
 *                                   type: array
 *                                   items:
 *                                     type: string
 *                                   example: ["chest"]
 *                                 secondaryMuscles:
 *                                   type: array
 *                                   items:
 *                                     type: string
 *                                   example: ["shoulders", "triceps"]
 *                                 category:
 *                                   type: string
 *                                   enum: [STRENGTH, CARDIO, MOBILITY]
 *                                   example: "STRENGTH"
 *                                 level:
 *                                   type: string
 *                                   enum: [BEGINNER, INTERMEDIATE, ADVANCED]
 *                                   example: "BEGINNER"
 *                       _count:
 *                         type: object
 *                         properties:
 *                           routineExercises:
 *                             type: integer
 *                             example: 8
 *                             description: "Total number of exercises in routine"
 *                           votes:
 *                             type: integer
 *                             example: 15
 *                             description: "Number of votes received (if public)"
 *                           workouts:
 *                             type: integer
 *                             example: 3
 *                             description: "Number of times this routine was used"
 *       401:
 *         description: Unauthorized
 */
router.get('/my', authenticateToken, RoutineController.getUserRoutines);

/**
 * @swagger
 * /api/routines/{id}:
 *   get:
 *     summary: Get routine by ID
 *     description: Get a specific routine by its ID
 *     tags: [Routines]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Routine retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/RoutineResponse'
 *       404:
 *         description: Routine not found
 */
router.get('/:id', RoutineController.getRoutineById);

/**
 * @swagger
 * /api/routines/{id}:
 *   put:
 *     summary: Update routine
 *     description: Update a routine (only by the author)
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [BEGINNER, INTERMEDIATE, ADVANCED]
 *               visibility:
 *                 type: string
 *                 enum: [PUBLIC, UNLISTED, PRIVATE]
 *     responses:
 *       200:
 *         description: Routine updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not the author of this routine
 *       404:
 *         description: Routine not found
 */
router.put('/:id', authenticateToken, RoutineController.updateRoutine);

/**
 * @swagger
 * /api/routines/{id}:
 *   delete:
 *     summary: Delete routine
 *     description: Delete a routine (only by the author)
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Routine deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not the author of this routine
 *       404:
 *         description: Routine not found
 */
router.delete('/:id', authenticateToken, RoutineController.deleteRoutine);

/**
 * @swagger
 * /api/routines/specific-exercise/{id}:
 *   get:
 *     summary: Get routine by ID
 *     description: Get a specific routine by its ID
 *     tags: [Routines]
 *     responses:
 *       200:
 *         description: Routine retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/RoutineResponse'
 *       404:
 *         description: Routine not found
 */
router.get('/specific-exercise/:id', authenticateToken, RoutineController.suggestedExercises);

/**
 * @swagger
 * /api/routines/{id}/exercises:
 *   post:
 *     summary: Add exercise to routine
 *     description: |
 *       Add a single exercise to an existing routine. This allows you to build multi-day workout programs.
 *
 *       **Multi-Day Routine Example:**
 *       - Day 0 (Monday): Push exercises
 *       - Day 1 (Tuesday): Pull exercises
 *       - Day 2 (Wednesday): Leg exercises
 *
 *       **Building a Push/Pull/Legs Split:**
 *
 *       1. First, get available exercises: `GET /api/exercises/list`
 *       2. Add Monday exercises (dayIndex: 0):
 *          - Bench Press (orderIndex: 0)
 *          - Incline Press (orderIndex: 1)
 *          - Shoulder Press (orderIndex: 2)
 *       3. Add Tuesday exercises (dayIndex: 1):
 *          - Pull-ups (orderIndex: 0)
 *          - Rows (orderIndex: 1)
 *       4. Continue for other days...
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Routine ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddExerciseToRoutineRequest'
 *           examples:
 *             monday_first_exercise:
 *               summary: Monday - First Exercise (Bench Press)
 *               description: Add bench press as the first exercise on Monday
 *               value:
 *                 exerciseId: 1
 *                 dayIndex: 0
 *                 orderIndex: 0
 *                 sets: "4"
 *                 reps: "8"
 *                 restSeconds: 90
 *                 notes: "Focus on controlled movement"
 *             monday_second_exercise:
 *               summary: Monday - Second Exercise (auto-order)
 *               description: Add incline press as second exercise - orderIndex will be auto-assigned
 *               value:
 *                 exerciseId: 5
 *                 dayIndex: 0
 *                 sets: "3-4"
 *                 reps: "8-10"
 *                 restSeconds: 75
 *                 notes: "45-degree angle"
 *             tuesday_first_exercise:
 *               summary: Tuesday - First Exercise (Pull-ups)
 *               description: Add pull-ups as the first exercise on Tuesday
 *               value:
 *                 exerciseId: 12
 *                 dayIndex: 1
 *                 orderIndex: 0
 *                 sets: "3-4"
 *                 reps: "To failure"
 *                 restSeconds: 120
 *                 notes: "Use assistance if needed"
 *             tuesday_additional_exercise:
 *               summary: Tuesday - Additional Exercise (auto-order)
 *               description: Add another exercise to Tuesday - orderIndex auto-assigned
 *               value:
 *                 exerciseId: 15
 *                 dayIndex: 1
 *                 sets: "AMRAP"
 *                 reps: "12-15"
 *             basic_exercise:
 *               summary: Basic Exercise Addition
 *               description: Simple exercise with minimal details (auto-order)
 *               value:
 *                 exerciseId: 3
 *                 dayIndex: 2
 *                 sets: "3"
 *                 reps: "12"
 *     responses:
 *       201:
 *         description: Exercise added to routine successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "routine-exercise-123"
 *                     dayIndex:
 *                       type: integer
 *                       example: 0
 *                     orderIndex:
 *                       type: integer
 *                       example: 0
 *                     sets:
 *                       type: integer
 *                       example: 4
 *                     reps:
 *                       type: integer
 *                       example: 8
 *                     exercise:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Bench Press"
 *                 message:
 *                   type: string
 *                   example: "Exercise added to routine successfully"
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not the author of this routine
 *       404:
 *         description: Routine or exercise not found
 */
router.post('/:id/exercises', authenticateToken, RoutineController.addExerciseToRoutine);

/**
 * @swagger
 * /api/routines/{id}/exercises/{exerciseId}:
 *   delete:
 *     summary: Remove exercise from routine
 *     description: |
 *       Remove a specific exercise from a routine. You need the routine exercise ID (not the exercise ID).
 *
 *       **How to get the routine exercise ID:**
 *       1. Get the routine: `GET /api/routines/{id}`
 *       2. Find the exercise in `routineExercises` array
 *       3. Use the `id` field (this is the routine exercise ID)
 *
 *       **Example Response from GET /api/routines/{id}:**
 *       ```json
 *       {
 *         "routineExercises": [
 *           {
 *             "id": "routine-exercise-123",  ← Use this ID
 *             "dayIndex": 0,
 *             "orderIndex": 0,
 *             "exercise": { "name": "Bench Press" }
 *           }
 *         ]
 *       }
 *       ```
 *
 *       **Then delete:** `DELETE /api/routines/{routineId}/exercises/routine-exercise-123`
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Routine ID
 *         example: "routine-456"
 *       - name: exerciseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Routine Exercise ID (from routineExercises array)
 *         example: "routine-exercise-123"
 *     responses:
 *       200:
 *         description: Exercise removed from routine successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: "null"
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Exercise removed from routine successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not the author of this routine
 *       404:
 *         description: Exercise not found in routine
 */
router.delete(
  '/:id/exercises/:exerciseId',
  authenticateToken,
  RoutineController.removeExerciseFromRoutine
);

/**
 * @swagger
 * /api/routines/{id}/vote:
 *   post:
 *     summary: Vote on routine
 *     description: Upvote or downvote a routine
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: integer
 *                 enum: [1, -1]
 *                 description: 1 for upvote, -1 for downvote
 *             required:
 *               - value
 *     responses:
 *       200:
 *         description: Vote recorded successfully
 *       400:
 *         description: Invalid vote value
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/vote', authenticateToken, RoutineController.voteOnRoutine);

/**
 * @swagger
 * /api/routines/{id}/vote:
 *   delete:
 *     summary: Remove vote from routine
 *     description: Remove your vote from a routine
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vote removed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Vote not found
 */
router.delete('/:id/vote', authenticateToken, RoutineController.removeVote);

/**
 * @swagger
 * /api/routines/{id}/clone:
 *   post:
 *     summary: Clone routine
 *     description: Create a copy of an existing routine
 *     tags: [Routines]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Custom title for the cloned routine
 *     responses:
 *       201:
 *         description: Routine cloned successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Original routine not found
 */
router.post('/:id/clone', authenticateToken, RoutineController.cloneRoutine);

export { router as routineRoutes };
