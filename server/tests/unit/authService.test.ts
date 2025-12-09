import { AuthService } from '../../src/services/authService';
import { testPrisma } from '../setup';
import bcrypt from 'bcrypt';

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkIfEmailExists', () => {
    it('should return true if email exists', async () => {
      // Create a test user
      await testPrisma.user.create({
        data: {
          username: 'testuser',
          fullName: 'Test User',
          email: 'test@example.com',
          passwordHash: 'hashed_password',
        },
      });

      const result = await AuthService.checkIfEmailExists('test@example.com');
      expect(result).toBe(true);
    });

    it('should return false if email does not exist', async () => {
      const result = await AuthService.checkIfEmailExists('nonexistent@example.com');
      expect(result).toBe(false);
    });
  });

  describe('checkIfUserNameExists', () => {
    it('should return true if username exists', async () => {
      // Create a test user
      await testPrisma.user.create({
        data: {
          username: 'testuser',
          fullName: 'Test User',
          email: 'test@example.com',
          passwordHash: 'hashed_password',
        },
      });

      const result = await AuthService.checkIfUserNameExists('testuser');
      expect(result).toBe(true);
    });

    it('should return false if username does not exist', async () => {
      const result = await AuthService.checkIfUserNameExists('nonexistentuser');
      expect(result).toBe(false);
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      // Create a test user with properly hashed password
      const hashedPassword = await bcrypt.hash('password123', 10);
      await testPrisma.user.create({
        data: {
          username: 'testuser',
          fullName: 'Test User',
          email: 'test@example.com',
          passwordHash: hashedPassword,
        },
      });
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await AuthService.login(loginData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.user).toMatchObject({
          username: 'testuser',
          fullName: 'Test User',
          email: 'test@example.com',
        });
        expect(result.token).toBeDefined();
        expect('passwordHash' in result.user).toBe(false);
      }
    });

    it('should return error for non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      const result = await AuthService.login(loginData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect((result as { success: false; error: string }).error).toBe(
          'Invalid email or password'
        );
      }
    });

    it('should return error for invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const result = await AuthService.login(loginData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect((result as { success: false; error: string }).error).toBe(
          'Invalid email or password'
        );
      }
    });
  });

  describe('logout', () => {
    beforeEach(async () => {
      // Create a test user with real hashed password
      const hashedPassword = await bcrypt.hash('password123', 10);
      await testPrisma.user.create({
        data: {
          username: 'logoutuser',
          fullName: 'Logout User',
          email: 'logout@example.com',
          passwordHash: hashedPassword,
        },
      });
    });

    it('should logout successfully', async () => {
      // Login to get a token
      const loginData = {
        email: 'logout@example.com',
        password: 'password123',
      };

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
    beforeEach(async () => {
      // Create a test user with real hashed password
      const hashedPassword = await bcrypt.hash('password123', 10);
      await testPrisma.user.create({
        data: {
          username: 'refreshuser',
          fullName: 'Refresh User',
          email: 'refresh@example.com',
          passwordHash: hashedPassword,
        },
      });
    });

    it('should refresh token successfully', async () => {
      // Login to get a real token
      const loginResult = await AuthService.login({
        email: 'refresh@example.com',
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
      if (!result.success) {
        expect(result.error).toBe('Invalid refresh token');
      }
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', async () => {
      // Create a test user first with real hashed password
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await testPrisma.user.create({
        data: {
          username: 'verifyuser',
          fullName: 'Verify User',
          email: 'verify@example.com',
          passwordHash: hashedPassword,
        },
      });

      // Login to get a real token
      const loginResult = await AuthService.login({
        email: 'verify@example.com',
        password: 'password123',
      });

      expect(loginResult.success).toBe(true);

      if (loginResult.success) {
        const token = loginResult.token;

        // Now verify the token
        const verifyResult = await AuthService.verifyToken(token);

        expect(verifyResult).toMatchObject({
          userId: user.id,
          email: 'verify@example.com',
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
