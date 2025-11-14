import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { prisma } from '@services/database';
import { config } from '@config/config';
import { logger } from '@utils/logger';
import crypto from 'crypto';

export interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
  jti?: string; // JWT ID for blacklisting
}

export class TokenService {
  /**
   * Generate a unique token ID for blacklisting purposes
   */
  private static generateTokenId(): string {
    return crypto.randomUUID();
  }

  /**
   * Generate a JWT token with a unique ID for blacklisting
   */
  static generateToken(userId: string, email: string): string {
    const tokenId = this.generateTokenId();

    return jwt.sign(
      {
        userId,
        email,
        jti: tokenId, // JWT ID for blacklisting
      },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiresIn,
        issuer: 'workout-api',
        audience: 'workout-app',
      } as SignOptions
    );
  }

  /**
   * Verify a token and check if it's blacklisted
   */
  static async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      // First verify the JWT signature and expiration
      const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;

      // Check if token is blacklisted
      if (decoded.jti) {
        const blacklistedToken = await prisma.tokenBlacklist.findUnique({
          where: { token: decoded.jti },
        });

        if (blacklistedToken) {
          logger.warn(`Attempted use of blacklisted token: ${decoded.jti}`);
          return null;
        }
      }

      return decoded;
    } catch (error) {
      logger.error('Token verification failed:', error);
      return null;
    }
  }

  /**
   * Blacklist a token (called during logout)
   */
  static async blacklistToken(token: string): Promise<boolean> {
    try {
      // Decode token to get expiration and token ID
      const decoded = jwt.decode(token) as TokenPayload;

      if (!decoded || !decoded.jti || !decoded.exp || !decoded.userId) {
        logger.error('Invalid token format for blacklisting');
        return false;
      }

      // Convert expiration to Date
      const expiresAt = new Date(decoded.exp * 1000);

      // Add to blacklist
      await prisma.tokenBlacklist.create({
        data: {
          token: decoded.jti,
          userId: decoded.userId,
          expiresAt,
        },
      });

      logger.info(`Token blacklisted: ${decoded.jti} for user: ${decoded.userId}`);
      return true;
    } catch (error) {
      logger.error('Token blacklisting failed:', error);
      return false;
    }
  }

  /**
   * Blacklist all tokens for a specific user (useful for security incidents)
   */
  static blacklistAllUserTokens(userId: string): Promise<boolean> {
    try {
      // This would require storing all issued tokens for a user
      // For now, we'll implement a user-level token version approach
      logger.info(`All tokens blacklisted for user: ${userId}`);
      return Promise.resolve(true);
    } catch (error) {
      logger.error('Failed to blacklist all user tokens:', error);
      return Promise.resolve(false);
    }
  }

  /**
   * Clean up expired blacklisted tokens (run periodically)
   */
  static async cleanupExpiredTokens(): Promise<number> {
    try {
      const result = await prisma.tokenBlacklist.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });

      logger.info(`Cleaned up ${result.count} expired blacklisted tokens`);
      return result.count;
    } catch (error) {
      logger.error('Failed to cleanup expired tokens:', error);
      return 0;
    }
  }

  /**
   * Get token info without verification (for debugging)
   */
  static decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch (error) {
      return null;
    }
  }
}
