import { Router, type Router as ExpressRouter } from 'express';
import { authRoutes } from './auth';
import { userRoutes } from './users';
import { exerciseRoutes } from './exercises';
import { routineRoutes } from './routines';
import { workoutRoutes } from './workouts';
import { healthRoutes } from './health';

const router: ExpressRouter = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/exercises', exerciseRoutes);
router.use('/routines', routineRoutes);
router.use('/workouts', workoutRoutes);
router.use('/health', healthRoutes);

/**
 * @swagger
 * /api:
 *   get:
 *     summary: API information
 *     description: Returns basic information about the API
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "workout API Server"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     auth:
 *                       type: string
 *                       example: "/api/auth"
 *                     users:
 *                       type: string
 *                       example: "/api/users"
 *                     health:
 *                       type: string
 *                       example: "/api/health"
 */
router.get('/', (req, res) => {
  res.json({
    message: 'workout API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      exercises: '/api/exercises',
      routines: '/api/routines',
      workouts: '/api/workouts',
      health: '/api/health',
    },
  });
});

export { router as routes };
