import { Request, Response, NextFunction } from 'express';
import { CreateUserRequest, EmailLoginRequest } from '@/types';
import { AuthService } from '../services/authService';
import { logger } from '../utils/logger';

export class AuthController {
  static register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.body as CreateUserRequest;

      // Validate required fields
      if (!userData.email || !userData.username || !userData.password || !userData.fullName) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: email, username, password, fullName',
        });
        return;
      }

      const result = await AuthService.register(userData);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      logger.info(`New user registered: ${userData.email}`);
      res.status(201).json(result);
    } catch (error) {
      logger.error('Registration error:', error);
      next(error);
    }
  };

  static login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const loginData = req.body as EmailLoginRequest;

      if (!loginData.email || !loginData.password) {
        res.status(400).json({
          success: false,
          error: 'Email and password are required',
        });
        return;
      }

      const result = await AuthService.login(loginData);

      if (!result.success) {
        res.status(401).json(result);
        return;
      }

      logger.info(`User logged in: ${loginData.email}`);
      res.status(200).json(result);
    } catch (error) {
      logger.error('Login error:', error);
      next(error);
    }
  };

  static logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(400).json({
          success: false,
          error: 'No token provided for logout',
        });
        return;
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      const result = await AuthService.logout(token);

      if (!result.success) {
        res.status(400).json(result);
        return;
      }

      logger.info('User logged out successfully');
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      logger.error('Logout error:', error);
      next(error);
    }
  };

  static refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { refreshToken } = req.body as { refreshToken?: string };

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          error: 'Refresh token is required',
        });
        return;
      }

      const result = await AuthService.refreshToken(refreshToken);

      if (!result.success) {
        res.status(401).json(result);
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      logger.error('Token refresh error:', error);
      next(error);
    }
  };
}
