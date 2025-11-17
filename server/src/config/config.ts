import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000').transform(Number),

  // Database
  DATABASE_URL: z.string().optional(),

  // JWT
  JWT_SECRET: z.string().default('your-super-secret-jwt-key-change-this-in-production'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // CORS
  ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(Number), // 15 minutes
  RATE_LIMIT_MAX: z.string().default('100').transform(Number),

  // Email (optional)
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.string().optional().transform(Number),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  // File upload
  MAX_FILE_SIZE: z.string().default('10485760').transform(Number), // 10MB
  UPLOAD_DIR: z.string().default('uploads'),

  // API configuration
  EXERCISE_API_KEY: z.string().default('your-exercise-api-key-change-this-in-production'),
});

// Validate environment variables
const env = envSchema.parse(process.env);

export const config = {
  environment: env.NODE_ENV,
  port: env.PORT,

  database: {
    url: env.DATABASE_URL,
  },

  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },

  cors: {
    origin: env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()),
    credentials: true,
  },

  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
  },

  email: {
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
    from: env.EMAIL_FROM,
  },

  upload: {
    maxFileSize: env.MAX_FILE_SIZE,
    directory: env.UPLOAD_DIR,
  },

  externalApi: {
    exerciseApiKey: env.EXERCISE_API_KEY,
  },

  // API configuration
  api: {
    prefix: '/api',
    version: 'v1',
  },
} as const;
