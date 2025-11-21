import { Request, Response, NextFunction } from 'express';
import { config } from '@config/config';
import { logger } from '@utils/logger';

export interface CustomError extends Error {
  statusCode?: number;
  status?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _: NextFunction
): void => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`Error ${err.message}`);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { name: 'CastError', message, statusCode: 404 } as CustomError;
  }

  // Mongoose duplicate key
  type MongooseError = CustomError & { code?: number };
  if (err.name === 'MongoError' && (err as MongooseError).code === 11000) {
    const message = 'Duplicate field value entered';
    error = { name: 'MongoError', message, statusCode: 400 } as CustomError;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    type MongooseValidationError = CustomError & {
      errors: { [key: string]: { message: string } };
    };
    const validationErr = err as MongooseValidationError;
    const message = Object.values(validationErr.errors).map((val) => val.message);
    error = {
      name: 'ValidationError',
      message: message.join(', '),
      statusCode: 400,
    } as CustomError;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { name: 'JsonWebTokenError', message, statusCode: 401 } as CustomError;
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { name: 'TokenExpiredError', message, statusCode: 401 } as CustomError;
  }

  res.status(error.statusCode || error.status || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(config.environment === 'development' && { stack: err.stack }),
  });
};
