import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CreateUserRequest, EmailLoginRequest, JwtPayload, ServiceAuthResponse } from '@/types';
import { prisma } from '@services/database';
import { config } from '@/config/config';
import { logger } from '@/utils/logger';
import { TokenService } from '@services/tokenService';

export class AuthService {
  private static readonly JWT_SECRET = config.jwt.secret || 'fallback-secret-key';

  static async register(
    userData: CreateUserRequest
  ): Promise<ServiceAuthResponse | { success: false; error: string }> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: userData.email }, { username: userData.username }],
        },
      });

      if (existingUser) {
        return {
          success: false,
          error:
            existingUser.email === userData.email
              ? 'Email already registered'
              : 'Username already taken',
        };
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(userData.password, saltRounds);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          username: userData.username,
          fullName: userData.fullName,
          passwordHash,
        },
      });

      // Generate JWT token using TokenService
      const token = TokenService.generateToken(user.id, user.email);

      // Remove password hash from response
      const { passwordHash: _, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      logger.error('Registration service error:', error);
      return {
        success: false,
        error: 'Registration failed. Please try again.',
      };
    }
  }

  static async login(
    loginData: EmailLoginRequest
  ): Promise<ServiceAuthResponse | { success: false; error: string }> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: loginData.email },
      });

      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(loginData.password, user.passwordHash);

      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Invalid email or password',
        };
      }

      // Generate JWT token using TokenService
      const token = TokenService.generateToken(user.id, user.email);

      // Remove password hash from response
      const { passwordHash: _, ...userWithoutPassword } = user;

      return {
        success: true,
        user: userWithoutPassword,
        token,
      };
    } catch (error) {
      logger.error('Login service error:', error);
      return {
        success: false,
        error: 'Login failed. Please try again.',
      };
    }
  }

  static async refreshToken(
    refreshToken: string
  ): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, AuthService.JWT_SECRET) as JwtPayload;

      // Check if user still exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        return {
          success: false,
          error: 'Invalid refresh token',
        };
      }

      // Generate new access token using TokenService
      const newToken = TokenService.generateToken(user.id, user.email);

      return {
        success: true,
        token: newToken,
      };
    } catch (error) {
      logger.error('Token refresh service error:', error);
      return {
        success: false,
        error: 'Invalid refresh token',
      };
    }
  }

  static async verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
    const decoded = await TokenService.verifyToken(token);
    return decoded ? { userId: decoded.userId, email: decoded.email } : null;
  }

  static async logout(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const success = await TokenService.blacklistToken(token);

      if (!success) {
        return {
          success: false,
          error: 'Failed to invalidate token',
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      logger.error('Logout service error:', error);
      return {
        success: false,
        error: 'Logout failed. Please try again.',
      };
    }
  }
}
