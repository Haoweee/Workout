import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { config } from '@config/config';
import { logger } from '@utils/logger';
import { errorHandler } from '@middleware/errorHandler';
import { notFoundHandler } from '@middleware/notFoundHandler';
import { requestLogger } from '@middleware/requestLogger';
import { routes } from '@routes/index';
import { swaggerSpec } from '@config/swagger';
import { TokenCleanupService } from '@services/tokenCleanupService';
import { FileCleanupService } from '@services/fileCleanupService';

class Server {
  private app: express.Application;
  private readonly port: number;

  constructor() {
    this.app = express();
    this.port = config.port;
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandlers();
  }

  private initializeMiddlewares(): void {
    // Security middleware - more permissive for development
    this.app.use(
      helmet({
        contentSecurityPolicy:
          config.environment === 'development'
            ? false
            : {
                directives: {
                  defaultSrc: ["'self'"],
                  styleSrc: ["'self'", "'unsafe-inline'"],
                  scriptSrc: ["'self'"],
                  imgSrc: ["'self'", 'data:', 'https:'],
                },
              },
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy:
          config.environment === 'development' ? false : { policy: 'same-origin' },
      })
    );

    // CORS configuration
    this.app.use(
      cors({
        origin:
          config.environment === 'development'
            ? true // Allow all origins in development
            : config.cors.origin,
        credentials: config.cors.credentials,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
          'Content-Type',
          'Authorization',
          'X-Requested-With',
          'Accept',
          'Origin',
          'Access-Control-Request-Method',
          'Access-Control-Request-Headers',
        ],
        exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
        preflightContinue: false,
        optionsSuccessStatus: 200,
      })
    );

    // Compression
    this.app.use(compression());

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
      message: {
        error: 'Too many requests from this IP, please try again later.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    if (config.environment == 'production') this.app.use(limiter);

    // Request parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Logging
    if (config.environment !== 'test') {
      this.app.use(
        morgan('combined', {
          stream: { write: (message) => logger.info(message.trim()) },
        })
      );
    }
    this.app.use(requestLogger);

    // Static file serving for uploads with permissive CORS
    this.app.use(
      '/uploads',
      (req, res, next) => {
        // Add CORS headers for static files
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept'
        );
        next();
      },
      express.static(path.join(process.cwd(), 'uploads'))
    );

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.environment,
        version: process.env.npm_package_version || '1.0.0',
      });
    });
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api', routes);

    // Swagger API documentation
    if (config.environment !== 'production') {
      this.app.use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
          explorer: true,
          customCss: `
            .swagger-ui .topbar { display: none }
            .swagger-ui .info .title { color: #3b82f6; }
            .swagger-ui .scheme-container { background: #f8fafc; padding: 10px; border-radius: 4px; margin: 10px 0; }
          `,
          customSiteTitle: 'workout API Documentation',
          swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
            docExpansion: 'none',
            filter: true,
            showExtensions: true,
            showCommonExtensions: true,
          },
        })
      );

      // Swagger JSON endpoint
      this.app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
      });
    }
  }

  private initializeErrorHandlers(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  public start(): void {
    // Start token cleanup service
    TokenCleanupService.startCleanup(60); // Clean up every 60 minutes

    this.app.listen(this.port, () => {
      logger.info(`🚀 Server running on port ${this.port}`);
      logger.info(`📊 Environment: ${config.environment}`);
      logger.info(`🔗 Health check: http://localhost:${this.port}/health`);
      if (config.environment !== 'production') {
        logger.info(`📚 API docs: http://localhost:${this.port}/docs`);
      }

      // Initialize cleanup services
      FileCleanupService.scheduleCleanup();
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}

export { Server };
