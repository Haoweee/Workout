import { testRequest } from '../helpers';
import { CreateUserRequest } from '../../src/types';

describe('Authentication API', () => {
  // Helper function to complete OTP registration flow
  const registerUserWithOtp = async (userData: CreateUserRequest) => {
    // Step 1: Send OTP
    await testRequest
      .post('/api/auth/send-otp')
      .send({
        ...userData,
        confirmPassword: userData.password,
      })
      .expect(200);

    // Step 2: Verify OTP and complete registration (using predictable test OTP)
    const response = await testRequest.post('/api/auth/verify-otp').send({
      email: userData.email,
      otp: '123456', // Fixed OTP for tests
      type: 'register',
    });

    return response;
  };

  describe('OTP Registration Flow', () => {
    it('should complete full registration flow with OTP', async () => {
      const userData: CreateUserRequest = {
        username: 'johndoe',
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const response = await registerUserWithOtp(userData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        user: {
          username: 'johndoe',
          fullName: 'John Doe',
          email: 'john@example.com',
        },
      });

      // Password hash should not be in response
      expect(response.body.user.passwordHash).toBeUndefined();
    });

    it('should send OTP for new user registration', async () => {
      const userData = {
        username: 'johndoe',
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const response = await testRequest.post('/api/auth/send-otp').send(userData).expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'OTP sent successfully',
      });
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteData = {
        username: 'johndoe',
        email: 'john@example.com',
        // Missing fullName, password, and confirmPassword
      };

      const response = await testRequest
        .post('/api/auth/send-otp')
        .send(incompleteData)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: expect.stringContaining('Missing required fields'),
      });
    });

    it('should return 400 for duplicate email', async () => {
      const userData: CreateUserRequest = {
        username: 'johndoe',
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      // Register first user via OTP flow
      await registerUserWithOtp(userData);

      // Try to send OTP for duplicate email - should fail at send-otp stage
      const duplicateEmailData = {
        ...userData,
        username: 'differentuser',
        confirmPassword: userData.password,
      };

      const response = await testRequest
        .post('/api/auth/send-otp')
        .send(duplicateEmailData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Email already in use');
    });

    it('should return 400 for duplicate username', async () => {
      const userData: CreateUserRequest = {
        username: 'johndoe',
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      // Register first user via OTP flow
      await registerUserWithOtp(userData);

      // Try to send OTP for duplicate username - should fail at send-otp stage
      const duplicateUsernameData = {
        ...userData,
        email: 'different@example.com',
        confirmPassword: userData.password,
      };

      const response = await testRequest
        .post('/api/auth/send-otp')
        .send(duplicateUsernameData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Username already in use');
    });

    it('should return 400 for mismatched passwords', async () => {
      const userData = {
        username: 'johndoe',
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'differentpassword',
      };

      const response = await testRequest.post('/api/auth/send-otp').send(userData).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Password and confirm password do not match');
    });

    it('should return 400 for invalid OTP', async () => {
      const userData = {
        username: 'johndoe',
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      };

      // Send OTP first
      await testRequest.post('/api/auth/send-otp').send(userData).expect(200);

      // Try to verify with wrong OTP
      const response = await testRequest
        .post('/api/auth/verify-otp')
        .send({
          email: userData.email,
          otp: '999999', // Wrong OTP
          type: 'register',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid or expired OTP');
    });

    it('should return 400 for missing email and OTP in verify', async () => {
      const response = await testRequest
        .post('/api/auth/verify-otp')
        .send({
          type: 'register',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Email and OTP are required');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test using OTP flow
      const userData: CreateUserRequest = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      await registerUserWithOtp(userData);
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await testRequest.post('/api/auth/login').send(loginData).expect(200);

      expect(response.body).toMatchObject({
        success: true,
        user: {
          username: 'testuser',
          fullName: 'Test User',
          email: 'test@example.com',
        },
      });

      // Password hash should not be in response
      expect(response.body.user.passwordHash).toBeUndefined();
    });

    it('should return 400 for missing email', async () => {
      const loginData = {
        password: 'password123',
      };

      const response = await testRequest.post('/api/auth/login').send(loginData).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Email and password are required');
    });

    it('should return 400 for missing password', async () => {
      const loginData = {
        email: 'test@example.com',
      };

      const response = await testRequest.post('/api/auth/login').send(loginData).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Email and password are required');
    });

    it('should return 401 for invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      const response = await testRequest.post('/api/auth/login').send(loginData).expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid email or password');
    });

    it('should return 401 for invalid password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const response = await testRequest.post('/api/auth/login').send(loginData).expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid email or password');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should return 400 for missing refresh token', async () => {
      const response = await testRequest.post('/api/auth/refresh').send({}).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Refresh token is required');
    });

    it('should return 401 for invalid refresh token', async () => {
      const response = await testRequest
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid refresh token');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await testRequest.post('/api/auth/logout').expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });
});
