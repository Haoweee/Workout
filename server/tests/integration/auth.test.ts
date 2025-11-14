import { testRequest } from '../helpers';
import { CreateUserRequest } from '../../src/types';

describe('Authentication API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData: CreateUserRequest = {
        username: 'johndoe',
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const response = await testRequest.post('/api/auth/register').send(userData).expect(201);

      expect(response.body).toMatchObject({
        success: true,
        user: {
          username: 'johndoe',
          fullName: 'John Doe',
          email: 'john@example.com',
        },
        token: expect.any(String),
      });

      // Password hash should not be in response
      expect(response.body.user.passwordHash).toBeUndefined();
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteData = {
        username: 'johndoe',
        email: 'john@example.com',
        // Missing fullName and password
      };

      const response = await testRequest
        .post('/api/auth/register')
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

      // Register first user
      await testRequest.post('/api/auth/register').send(userData).expect(201);

      // Try to register with same email
      const duplicateUser = {
        ...userData,
        username: 'differentuser',
      };

      const response = await testRequest.post('/api/auth/register').send(duplicateUser).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Email already registered');
    });

    it('should return 400 for duplicate username', async () => {
      const userData: CreateUserRequest = {
        username: 'johndoe',
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      // Register first user
      await testRequest.post('/api/auth/register').send(userData).expect(201);

      // Try to register with same username
      const duplicateUser = {
        ...userData,
        email: 'different@example.com',
      };

      const response = await testRequest.post('/api/auth/register').send(duplicateUser).expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Username already taken');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      const userData: CreateUserRequest = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      await testRequest.post('/api/auth/register').send(userData);
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
        token: expect.any(String),
      });

      // Password hash should not be in response
      expect(response.body.user.passwordHash).toBeUndefined();
    });

    it('should return 400 for missing email', async () => {
      const loginData = {
        password: 'password123',
      };

      const response = await testRequest.post('/api/auth/login').send(loginData).expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Email and password are required',
      });
    });

    it('should return 400 for missing password', async () => {
      const loginData = {
        email: 'test@example.com',
      };

      const response = await testRequest.post('/api/auth/login').send(loginData).expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Email and password are required',
      });
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
    let validToken: string;

    beforeEach(async () => {
      // Register and login to get a token
      const userData: CreateUserRequest = {
        username: 'testuser',
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      await testRequest.post('/api/auth/register').send(userData);

      const loginResponse = await testRequest.post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });

      validToken = loginResponse.body.token;
    });

    it('should refresh token with valid refresh token', async () => {
      const response = await testRequest
        .post('/api/auth/refresh')
        .send({ refreshToken: validToken })
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        token: expect.any(String),
      });

      // Token should be a valid JWT format
      expect(response.body.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
    });

    it('should return 400 for missing refresh token', async () => {
      const response = await testRequest.post('/api/auth/refresh').send({}).expect(400);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Refresh token is required',
      });
    });

    it('should return 401 for invalid refresh token', async () => {
      const response = await testRequest
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      // First register and login to get a token
      const userData = {
        username: 'logoutuser',
        fullName: 'Logout User',
        email: 'logout@example.com',
        password: 'password123',
      };

      await testRequest.post('/api/auth/register').send(userData);

      const loginResponse = await testRequest.post('/api/auth/login').send({
        email: 'logout@example.com',
        password: 'password123',
      });

      const token = loginResponse.body.token;

      // Now logout with the token
      const response = await testRequest
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Logged out successfully',
      });
    });

    it('should return 400 for missing token', async () => {
      const response = await testRequest.post('/api/auth/logout').expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('No token provided for logout');
    });
  });
});
