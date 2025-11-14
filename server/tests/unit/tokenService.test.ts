import { TokenService } from '../../src/services/tokenService';
import { testPrisma } from '../setup';
import crypto from 'crypto';

describe('TokenService', () => {
  beforeEach(async () => {
    // Clean up token blacklist before each test
    await testPrisma.tokenBlacklist.deleteMany();
  });

  describe('Token Generation and Verification', () => {
    it('should generate a token with unique ID', () => {
      const userId = crypto.randomUUID();
      const token1 = TokenService.generateToken(userId, 'test1@example.com');
      const token2 = TokenService.generateToken(userId, 'test1@example.com');

      expect(token1).toBeDefined();
      expect(token2).toBeDefined();
      expect(token1).not.toBe(token2); // Tokens should be different due to unique jti
    });

    it('should verify valid tokens', async () => {
      const userId = crypto.randomUUID();
      const email = 'test@example.com';
      const token = TokenService.generateToken(userId, email);

      const decoded = await TokenService.verifyToken(token);

      expect(decoded).not.toBeNull();
      expect(decoded!.userId).toBe(userId);
      expect(decoded!.email).toBe(email);
      expect(decoded!.jti).toBeDefined();
    });

    it('should reject invalid tokens', async () => {
      const decoded = await TokenService.verifyToken('invalid-token');
      expect(decoded).toBeNull();
    });
  });

  describe('Token Blacklisting', () => {
    it('should blacklist a token successfully', async () => {
      const userId = crypto.randomUUID();
      const email = 'test@example.com';
      const token = TokenService.generateToken(userId, email);

      // First verify the token works
      const decoded1 = await TokenService.verifyToken(token);
      expect(decoded1).not.toBeNull();

      // Blacklist the token
      const blacklisted = await TokenService.blacklistToken(token);
      expect(blacklisted).toBe(true);

      // Now the token should be rejected
      const decoded2 = await TokenService.verifyToken(token);
      expect(decoded2).toBeNull();
    });

    it('should store blacklisted token in database', async () => {
      const userId = crypto.randomUUID();
      const email = 'test@example.com';
      const token = TokenService.generateToken(userId, email);

      await TokenService.blacklistToken(token);

      // Check if token is in blacklist table
      const decoded = TokenService.decodeToken(token);
      const blacklistedToken = await testPrisma.tokenBlacklist.findUnique({
        where: { token: decoded!.jti! },
      });

      expect(blacklistedToken).not.toBeNull();
      expect(blacklistedToken!.userId).toBe(userId);
    });

    it('should handle invalid tokens during blacklisting', async () => {
      const result = await TokenService.blacklistToken('invalid-token');
      expect(result).toBe(false);
    });
  });

  describe('Token Cleanup', () => {
    it('should clean up expired tokens', async () => {
      const userId = crypto.randomUUID();

      // Create a blacklisted token that's already expired
      const expiredDate = new Date(Date.now() - 1000 * 60 * 60); // 1 hour ago

      await testPrisma.tokenBlacklist.create({
        data: {
          token: 'expired-token-id',
          userId: userId,
          expiresAt: expiredDate,
        },
      });

      // Create a non-expired token
      const futureDate = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now

      await testPrisma.tokenBlacklist.create({
        data: {
          token: 'valid-token-id',
          userId: userId,
          expiresAt: futureDate,
        },
      });

      // Run cleanup
      const deletedCount = await TokenService.cleanupExpiredTokens();

      expect(deletedCount).toBe(1);

      // Verify only the non-expired token remains
      const remainingTokens = await testPrisma.tokenBlacklist.findMany();
      expect(remainingTokens).toHaveLength(1);
      expect(remainingTokens[0]?.token).toBe('valid-token-id');
    });
  });
});
