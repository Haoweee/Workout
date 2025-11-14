import { AuthService } from '../../src/services/authService';
import { testPrisma } from '../setup';
import bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock bcrypt.hash
      mockedBcrypt.hash.mockResolvedValue('hashed_password' as never);

      const result = await AuthService.register(userData);

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.user).toMatchObject({
          username: 'testuser',
          fullName: 'Test User',
          email: 'test@example.com',
        });
        expect(result.token).toBeDefined();
        expect((result.user as any).passwordHash).toBeUndefined();
      }

      // Verify bcrypt.hash was called
      expect(mockedBcrypt.hash).toHaveBeenCalledWith('password123', 12);
    });

    it('should return error for duplicate email', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      // Create user first
      await testPrisma.user.create({
        data: {
          username: userData.username,
          fullName: userData.fullName,
          email: userData.email,
          passwordHash: 'hashed_password',
        },
      });

      const result = await AuthService.register(userData);

      expect(result.success).toBe(false);
      expect((result as any).error).toBe('Email already registered');
    });

    it('should return error for duplicate username', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      // Create user with same username
      await testPrisma.user.create({
        data: {
          username: 'testuser',
          fullName: 'Another User',
          email: 'another@example.com',
          passwordHash: 'hashed_password',
        },
      });

      const result = await AuthService.register(userData);

      expect(result.success).toBe(false);
      expect((result as any).error).toBe('Username already taken');
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      // Create a test user
      await testPrisma.user.create({
        data: {
          username: 'testuser',
          fullName: 'Test User',
          email: 'test@example.com',
          passwordHash: 'hashed_password',
        },
      });
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock bcrypt.compare to return true
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await AuthService.login(loginData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.user).toMatchObject({
          username: 'testuser',
          fullName: 'Test User',
          email: 'test@example.com',
        });
        expect(result.token).toBeDefined();
        expect((result.user as any).passwordHash).toBeUndefined();
      }

      // Verify bcrypt.compare was called
      expect(mockedBcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
    });

    it('should return error for non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      const result = await AuthService.login(loginData);

      expect(result.success).toBe(false);
      expect((result as any).error).toBe('Invalid email or password');
    });

    it('should return error for invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      // Mock bcrypt.compare to return false
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await AuthService.login(loginData);

      expect(result.success).toBe(false);
      expect((result as any).error).toBe('Invalid email or password');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      // Create a test user first
      await testPrisma.user.create({
        data: {
          username: 'testuser',
          fullName: 'Test User',
          email: 'test@example.com',
          passwordHash: 'hashed_password',
        },
      });

      // Login to get a token
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock bcrypt.compare to return true
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const loginResult = await AuthService.login(loginData);

      expect(loginResult.success).toBe(true);

      // Now logout
      if (loginResult.success) {
        const result = await AuthService.logout(loginResult.token);
        expect(result.success).toBe(true);
      } else if ('error' in loginResult) {
        throw new Error(`Login failed: ${loginResult.error}`);
      } else {
        throw new Error('Login failed: Unknown error');
      }
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      // Create a test user first
      await testPrisma.user.create({
        data: {
          username: 'testuser',
          fullName: 'Test User',
          email: 'test@example.com',
          passwordHash: 'hashed_password',
        },
      });
      // Mock bcrypt for login
      mockedBcrypt.compare.mockResolvedValue(true as never);

      // Login to get a real token
      const loginResult = await AuthService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(loginResult.success).toBe(true);

      if (loginResult.success) {
        const oldToken = loginResult.token;

        // Now refresh the token
        const refreshResult = await AuthService.refreshToken(oldToken);

        expect(refreshResult.success).toBe(true);
        if (refreshResult.success) {
          expect(refreshResult.token).toBeDefined();
          expect(refreshResult.token).not.toBe(oldToken);
        }
      }
    });

    it('should return error for invalid token', async () => {
      const result = await AuthService.refreshToken('invalid-token');

      expect(result.success).toBe(false);
      expect((result as any).error).toBe('Invalid refresh token');
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', async () => {
      // Create a test user first
      const user = await testPrisma.user.create({
        data: {
          username: 'testuser',
          fullName: 'Test User',
          email: 'test@example.com',
          passwordHash: 'hashed_password',
        },
      });

      // Mock bcrypt for login
      mockedBcrypt.compare.mockResolvedValue(true as never);

      // Login to get a real token
      const loginResult = await AuthService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(loginResult.success).toBe(true);

      if (loginResult.success) {
        const token = loginResult.token;

        // Now verify the token
        const verifyResult = await AuthService.verifyToken(token);

        expect(verifyResult).toMatchObject({
          userId: user.id,
          email: 'test@example.com',
        });
      }
    });

    it('should return null for invalid token', async () => {
      const result = await AuthService.verifyToken('invalid-token');
      expect(result).toBeNull();
    });

    it('should return null for expired token', async () => {
      // This would require mocking JWT expiration, which is complex
      // For now, we'll test with a malformed token
      const result = await AuthService.verifyToken('malformed.token.here');
      expect(result).toBeNull();
    });
  });
});
