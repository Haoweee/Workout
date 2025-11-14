import { UserService } from '../../src/services/userService';
import { testPrisma } from '../setup';

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should retrieve user profile by ID', async () => {
      const user = await testPrisma.user.create({
        data: {
          username: 'testuser',
          fullName: 'Test User',
          email: 'testuser@example.com',
          passwordHash: 'hashed_password',
        },
      });

      const profile = await UserService.getUserById(user.id);
      expect(profile).toMatchObject({
        id: user.id,
        username: 'testuser',
        fullName: 'Test User',
        email: 'testuser@example.com',
      });
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const user = await testPrisma.user.create({
        data: {
          username: 'oldusername',
          fullName: 'Old Name',
          email: 'oldemail@example.com',
          passwordHash: 'hashed_password',
        },
      });

      const updateData = {
        username: 'newusername',
        fullName: 'New Name',
        email: 'newemail@example.com',
      };

      const updatedUser = await UserService.updateProfile(user.id, updateData);
      expect(updatedUser).toMatchObject({
        id: user.id,
        username: 'newusername',
        fullName: 'New Name',
        email: 'newemail@example.com',
      });
    });
  });

  describe('getAllUsers', () => {
    it('should retrieve a list of users with pagination', async () => {
      // Seed some users
      for (let i = 1; i <= 15; i++) {
        await testPrisma.user.create({
          data: {
            username: `user${i}`,
            fullName: `User ${i}`,
            email: `user${i}@example.com`,
            passwordHash: 'hashed_password',
          },
        });
      }

      const page = 1;
      const limit = 10;
      const result = await UserService.searchUsers('', page, limit);

      expect(result.users.length).toBe(10);
      expect(result.pagination.page).toBe(page);
      expect(result.pagination.limit).toBe(limit);
      expect(result.pagination.total).toBe(15);
      expect(result.pagination.pages).toBe(2);
    });
  });

  describe('getUserById', () => {
    it('should return null for non-existing user ID', async () => {
      const profile = await UserService.getUserById('c7307588-a87f-4ba1-9a54-d1db2d80cd94');
      expect(profile).toBeNull();
    });
  });

  describe('deactivateUser', () => {
    it('should deactivate a user successfully', async () => {
      const user = await testPrisma.user.create({
        data: {
          username: 'activeuser',
          fullName: 'Active User',
          email: 'activeuser@example.com',
          passwordHash: 'hashed_password',
        },
      });

      const deactivatedUser = await UserService.deactivateUser(user.id);
      expect(deactivatedUser).toMatchObject({
        id: user.id,
        isActive: false,
      });
    });
  });

  describe('reactivateUser', () => {
    it('should reactivate a deactivated user successfully', async () => {
      const user = await testPrisma.user.create({
        data: {
          username: 'deactivateduser',
          fullName: 'Deactivated User',
          email: 'deactivateduser@example.com',
          passwordHash: 'hashed_password',
        },
      });

      const reactivatedUser = await UserService.reactivateUser(user.id);
      expect(reactivatedUser).toMatchObject({
        id: user.id,
        isActive: true,
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const user = await testPrisma.user.create({
        data: {
          username: 'tobedeleted',
          fullName: 'To Be Deleted',
          email: 'tobedeleted@example.com',
          passwordHash: 'hashed_password',
        },
      });

      const deletedUser = await UserService.deleteUser(user.id);
      expect(deletedUser).toMatchObject({
        id: user.id,
      });
    });
  });
});
