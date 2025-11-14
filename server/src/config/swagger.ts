import swaggerJsdoc from 'swagger-jsdoc';
import { config } from '@config/config';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Workout API',
      version: '1.0.0',
      description: 'Node.js TypeScript API server for Workout Management Application',
      contact: {
        name: 'API Support',
        email: 'support@workout.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server',
      },
      {
        url: 'https://api.workout.com',
        description: 'Production server',
      },
    ],
    tags: [
      {
        name: 'General',
        description: 'General API information',
      },
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Authentication',
        description: 'User authentication and authorization',
      },
      {
        name: 'Users',
        description: 'User management operations',
      },
      {
        name: 'Exercises',
        description: 'Exercise management operations',
      },
      {
        name: 'Routines',
        description: 'Workout routine management operations',
      },
      {
        name: 'Workouts',
        description: 'Workout management operations',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: `
            Enter your JWT token here. You can get it by:
            1. Calling POST /api/auth/login
            2. Copying the 'token' field from the response
            3. Entering it here (without 'Bearer' prefix)
          `,
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User unique identifier',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            username: {
              type: 'string',
              description: 'User username',
            },
            fullName: {
              type: 'string',
              description: 'User full name',
            },
            avatarUrl: {
              type: 'string',
              description: 'User avatar URL',
              nullable: true,
            },
            bio: {
              type: 'string',
              description: 'User bio/description',
              nullable: true,
            },
            isActive: {
              type: 'boolean',
              description: 'Whether user account is active',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
            },
          },
          required: ['id', 'email', 'username', 'fullName', 'isActive'],
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
            token: {
              type: 'string',
              description: 'JWT access token',
            },
            refreshToken: {
              type: 'string',
              description: 'JWT refresh token',
            },
          },
          required: ['success', 'user', 'token'],
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
            },
            message: {
              type: 'string',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
            error: {
              type: 'string',
            },
          },
          required: ['success'],
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              description: 'Error message',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            path: {
              type: 'string',
              description: 'Request path',
            },
          },
          required: ['success', 'error'],
        },
        Exercise: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Exercise unique identifier',
            },
            name: {
              type: 'string',
              description: 'Exercise name',
            },
            equipment: {
              type: 'string',
              description: 'Required equipment',
              nullable: true,
            },
            category: {
              type: 'string',
              enum: ['STRENGTH', 'CARDIO', 'MOBILITY'],
              description: 'Exercise category',
              nullable: true,
            },
            primaryMuscles: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Primary muscles targeted',
            },
            secondaryMuscles: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Secondary muscles targeted',
            },
            level: {
              type: 'string',
              enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
              description: 'Exercise difficulty level',
              nullable: true,
            },
            force: {
              type: 'string',
              enum: ['PUSH', 'PULL', 'STATIC'],
              description: 'Force type (push, pull, static)',
              nullable: true,
            },
            mechanic: {
              type: 'string',
              enum: ['COMPOUND', 'ISOLATION'],
              description: 'Movement mechanic (compound, isolation)',
              nullable: true,
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Exercise image URLs',
            },
            instructions: {
              type: 'string',
              description: 'Exercise instructions',
              nullable: true,
            },
            exerciseId: {
              type: 'string',
              description: 'External exercise identifier',
              nullable: true,
            },
          },
          required: ['id', 'name', 'primaryMuscles', 'secondaryMuscles', 'images'],
        },
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              description: 'Current page number',
              minimum: 1,
            },
            limit: {
              type: 'integer',
              description: 'Number of items per page',
              minimum: 1,
            },
            total: {
              type: 'integer',
              description: 'Total number of items',
              minimum: 0,
            },
            pages: {
              type: 'integer',
              description: 'Total number of pages',
              minimum: 0,
            },
          },
          required: ['page', 'limit', 'total', 'pages'],
        },
        CreateRoutineRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Routine title',
              maxLength: 140,
            },
            description: {
              type: 'string',
              description: 'Routine description',
              nullable: true,
            },
            difficulty: {
              type: 'string',
              enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
              description: 'Routine difficulty level',
              nullable: true,
            },
            visibility: {
              type: 'string',
              enum: ['PUBLIC', 'UNLISTED', 'PRIVATE'],
              description: 'Routine visibility',
              default: 'PRIVATE',
            },
            exercises: {
              type: 'array',
              description:
                'Optional array of exercises to add to the routine. Leave empty to create an empty routine.',
              items: {
                type: 'object',
                properties: {
                  exerciseId: {
                    type: 'integer',
                    description: 'Exercise ID',
                  },
                  dayIndex: {
                    type: 'integer',
                    description: 'Day index (0-based)',
                    minimum: 0,
                  },
                  orderIndex: {
                    type: 'integer',
                    description: 'Order within the day (0-based)',
                    minimum: 0,
                  },
                  sets: {
                    type: 'string',
                    description:
                      'Number of sets - can be a number like "3" or range like "3-4" or text like "AMRAP"',
                    nullable: true,
                    examples: ['3', '3-4', 'AMRAP', '2-3'],
                  },
                  reps: {
                    type: 'string',
                    description:
                      'Number of reps per set - can be a number like "8" or range like "8-10" or text like "To failure"',
                    nullable: true,
                    examples: ['8', '8-10', '12-15', 'To failure', 'AMRAP'],
                  },
                  restSeconds: {
                    type: 'integer',
                    description: 'Rest time between sets in seconds',
                    minimum: 0,
                    nullable: true,
                  },
                  notes: {
                    type: 'string',
                    description: 'Additional notes for this exercise',
                    nullable: true,
                  },
                },
                required: ['exerciseId', 'dayIndex', 'orderIndex'],
              },
            },
          },
          required: ['title', 'visibility'],
        },
        AddExerciseToRoutineRequest: {
          type: 'object',
          properties: {
            exerciseId: {
              type: 'integer',
              description: 'Exercise ID to add to the routine',
            },
            dayIndex: {
              type: 'integer',
              description: 'Day index (0-based)',
              minimum: 0,
            },
            orderIndex: {
              type: 'integer',
              description:
                'Order within the day (0-based). If not provided, will be auto-assigned as the last exercise for the day.',
              minimum: 0,
              nullable: true,
            },
            sets: {
              type: 'string',
              description:
                'Number of sets - can be a number like "3" or range like "3-4" or text like "AMRAP"',
              nullable: true,
              examples: ['3', '3-4', 'AMRAP', '2-3'],
            },
            reps: {
              type: 'string',
              description:
                'Number of reps per set - can be a number like "8" or range like "8-10" or text like "To failure"',
              nullable: true,
              examples: ['8', '8-10', '12-15', 'To failure', 'AMRAP'],
            },
            restSeconds: {
              type: 'integer',
              description: 'Rest time between sets in seconds',
              minimum: 0,
              nullable: true,
            },
            notes: {
              type: 'string',
              description: 'Additional notes for this exercise',
              nullable: true,
            },
          },
          required: ['exerciseId', 'dayIndex'],
        },
        RoutineResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Routine unique identifier',
            },
            title: {
              type: 'string',
              description: 'Routine title',
            },
            description: {
              type: 'string',
              description: 'Routine description',
              nullable: true,
            },
            difficulty: {
              type: 'string',
              enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
              description: 'Routine difficulty level',
              nullable: true,
            },
            visibility: {
              type: 'string',
              enum: ['PUBLIC', 'UNLISTED', 'PRIVATE'],
              description: 'Routine visibility',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
            author: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                  description: 'Author user ID',
                },
                username: {
                  type: 'string',
                  description: 'Author username',
                },
                fullName: {
                  type: 'string',
                  description: 'Author full name',
                },
              },
            },
            routineExercises: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  dayIndex: {
                    type: 'integer',
                    description: 'Day index',
                  },
                  orderIndex: {
                    type: 'integer',
                    description: 'Order within the day',
                  },
                  sets: {
                    type: 'string',
                    nullable: true,
                    description: 'Number of sets (can be range like "3-4" or text like "AMRAP")',
                  },
                  reps: {
                    type: 'string',
                    nullable: true,
                    description:
                      'Number of reps (can be range like "8-10" or text like "To failure")',
                  },
                  restSeconds: {
                    type: 'integer',
                    nullable: true,
                  },
                  notes: {
                    type: 'string',
                    nullable: true,
                  },
                  exercise: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                      },
                      name: {
                        type: 'string',
                      },
                      equipment: {
                        type: 'string',
                        nullable: true,
                      },
                      primaryMuscles: {
                        type: 'array',
                        items: {
                          type: 'string',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          required: ['id', 'title', 'visibility', 'createdAt', 'updatedAt'],
        },
        Workout: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Workout unique identifier',
            },
            userId: {
              type: 'string',
              description: 'User ID who owns the workout',
            },
            routineId: {
              type: 'string',
              description: 'Associated routine ID (optional)',
              nullable: true,
            },
            title: {
              type: 'string',
              description: 'Workout title',
              nullable: true,
            },
            visibility: {
              type: 'string',
              enum: ['PUBLIC', 'UNLISTED', 'PRIVATE'],
              description: 'Workout visibility',
            },
            startedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Workout start timestamp',
            },
            finishedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Workout finish timestamp',
              nullable: true,
            },
          },
          required: ['id', 'userId', 'visibility', 'startedAt'],
        },
        WorkoutSet: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Workout set unique identifier',
            },
            workoutId: {
              type: 'string',
              description: 'Associated workout ID',
            },
            exerciseId: {
              type: 'integer',
              description: 'Exercise ID',
              nullable: true,
            },
            customExerciseName: {
              type: 'string',
              description: 'Custom exercise name (if not using database exercise)',
              nullable: true,
            },
            setNumber: {
              type: 'integer',
              description: 'Set number within the exercise',
              minimum: 1,
            },
            reps: {
              type: 'integer',
              description: 'Number of repetitions performed',
              nullable: true,
            },
            weightKg: {
              type: 'number',
              description: 'Weight used in kilograms',
              nullable: true,
            },
            rpe: {
              type: 'number',
              description: 'Rate of Perceived Exertion (1.0-10.0)',
              minimum: 1,
              maximum: 10,
              nullable: true,
            },
            durationSec: {
              type: 'integer',
              description: 'Duration in seconds (for timed exercises)',
              nullable: true,
            },
            notes: {
              type: 'string',
              description: 'Additional notes for this set',
              nullable: true,
            },
            performedAt: {
              type: 'string',
              format: 'date-time',
              description: 'When the set was performed',
            },
          },
          required: ['id', 'workoutId', 'setNumber', 'performedAt'],
        },
        UserCustomExercise: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Custom exercise unique identifier',
            },
            userId: {
              type: 'string',
              description: 'User ID who created the exercise',
            },
            name: {
              type: 'string',
              description: 'Custom exercise name',
            },
            description: {
              type: 'string',
              description: 'Exercise description',
              nullable: true,
            },
            category: {
              type: 'string',
              enum: ['STRENGTH', 'CARDIO', 'MOBILITY'],
              description: 'Exercise category',
            },
            primaryMuscles: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Primary muscles targeted',
            },
            secondaryMuscles: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Secondary muscles targeted',
            },
            equipment: {
              type: 'string',
              description: 'Required equipment',
              nullable: true,
            },
            instructions: {
              type: 'string',
              description: 'Exercise instructions',
              nullable: true,
            },
            isPublic: {
              type: 'boolean',
              description: 'Whether exercise is publicly visible',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
          required: [
            'id',
            'userId',
            'name',
            'category',
            'primaryMuscles',
            'secondaryMuscles',
            'isPublic',
          ],
        },
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'healthy',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            uptime: {
              type: 'number',
              description: 'Server uptime in seconds',
            },
            environment: {
              type: 'string',
              description: 'Current environment',
            },
            version: {
              type: 'string',
              description: 'Application version',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/*.ts', // Path to the API routes
    './src/controllers/*.ts', // Path to the controllers
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
