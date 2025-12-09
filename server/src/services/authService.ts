import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CreateUserRequest, EmailLoginRequest, JwtPayload, ServiceAuthResponse } from '@/types';
import { prisma } from '@services/database';
import { config } from '@/config/config';
import { logger } from '@/utils/logger';
import { TokenService } from '@services/tokenService';

export class AuthService {
  private static readonly JWT_SECRET = config.jwt.secret || 'fallback-secret-key';

  static async checkIfEmailExists(email: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }],
      },
    });
    return !!user;
  }

  static async checkIfUserNameExists(username: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username }],
      },
    });
    return !!user;
  }

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
        if (existingUser.passwordHash === '') {
          // Allows user to assign password if registered via OAuth
          return {
            success: false,
            error: 'User registered via OAuth.',
          };
        } else {
          // User already exists with a password
          return {
            success: false,
            error:
              existingUser.email === userData.email
                ? 'Email already registered'
                : 'Username already taken',
          };
        }
      }

      // Hash password
      const saltRounds = config.saltRounds || 10;
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

  static linkOAuthAccount = async (
    email: string,
    provider: string,
    providerId: string
  ): Promise<ServiceAuthResponse | { success: false; error: string }> => {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      // Link OAuth provider
      await prisma.userProviders.upsert({
        where: {
          provider_providerId: {
            provider,
            providerId,
          },
        },
        update: {
          userId: user.id,
        },
        create: {
          userId: user.id,
          provider,
          providerId,
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
      logger.error('Link OAuth account service error:', error);
      return {
        success: false,
        error: 'Linking OAuth account failed. Please try again.',
      };
    }
  };

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

  static async setPassword(
    userId: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Hash new password
      const saltRounds = config.saltRounds || 10;
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update user's password
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      });

      return { success: true };
    } catch (error) {
      logger.error('Set password service error:', error);
      return {
        success: false,
        error: 'Failed to set password. Please try again.',
      };
    }
  }

  static async changePassword(
    email: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Fetch user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      // Hash new password
      const saltRounds = config.saltRounds || 10;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update user's password
      await prisma.user.update({
        where: { email },
        data: { passwordHash: newPasswordHash },
      });

      return { success: true };
    } catch (error) {
      logger.error('Change password service error:', error);
      return {
        success: false,
        error: 'Failed to change password. Please try again.',
      };
    }
  }
}
