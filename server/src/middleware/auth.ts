import { Request, Response, NextFunction } from 'express';
import { TokenService } from '@services/tokenService';
import { logger } from '@utils/logger';

// Extend Express Request interface to include user info
import 'express';

declare module 'express' {
  export interface Request {
    user?: {
      userId: string;
      email: string;
      jti?: string;
    };
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    jti?: string;
  };
}

/**
 * Middleware to authenticate JWT tokens and check blacklist
 */
export const authenticateToken = async (
  req: Request & { cookies?: Record<string, string> },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Read JWT from cookie (auth_token)
    const token = req.cookies?.auth_token;

    if (typeof token !== 'string') {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
      return;
    }

    // Verify token and check blacklist
    const decoded = await TokenService.verifyToken(token);

    if (!decoded) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
      return;
    }

    // Add user info to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      ...(decoded.jti && { jti: decoded.jti }),
    };

    next();
  } catch (error) {
    logger.error('Token authentication error:', error);
    res.status(401).json({
      success: false,
      error: 'Token authentication failed',
    });
  }
};

/**
 * Optional middleware - only authenticate if token is provided
 */
export const optionalAuth = async (
  req: Request & { cookies?: Record<string, string> },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Read JWT from cookie (auth_token) if present
    const token = req.cookies?.auth_token;
    if (typeof token === 'string') {
      const decoded = await TokenService.verifyToken(token);
      if (decoded) {
        req.user = {
          userId: decoded.userId,
          email: decoded.email,
          ...(decoded.jti && { jti: decoded.jti }),
        };
      }
    }
    next();
  } catch (error) {
    // Don't fail on optional auth errors, just continue without user
    logger.warn('Optional auth failed:', error);
    next();
  }
};
