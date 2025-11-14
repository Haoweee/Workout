import { Router, Request, Response, type Router as ExpressRouter } from 'express';

const router: ExpressRouter = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API server
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *             example:
 *               status: "healthy"
 *               timestamp: "2023-10-25T10:30:00.000Z"
 *               uptime: 3600
 *               memory:
 *                 rss: 52428800
 *                 heapTotal: 26738688
 *                 heapUsed: 18934528
 *                 external: 1089024
 *               environment: "development"
 */
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
  });
});

/**
 * @swagger
 * /api/health/detailed:
 *   get:
 *     summary: Detailed health check
 *     description: Returns detailed health information about the server
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed server health information
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/HealthResponse'
 *                 - type: object
 *                   properties:
 *                     version:
 *                       type: string
 *                       description: Application version
 *                     node:
 *                       type: string
 *                       description: Node.js version
 *                     platform:
 *                       type: string
 *                       description: Operating system platform
 *                     arch:
 *                       type: string
 *                       description: CPU architecture
 */
router.get('/detailed', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    node: process.version,
    platform: process.platform,
    arch: process.arch,
  });
});

export { router as healthRoutes };
