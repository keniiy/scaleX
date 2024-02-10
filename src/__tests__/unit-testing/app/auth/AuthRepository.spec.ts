import UserRepo from '../../../../repository/userRepository';
import UserData from '../../../../utils/data/user';

describe('AuthRepository', () => {
  describe('findUserByEmail', () => {
    it('should return a user object when a user with the given email exists', async () => {
      const testEmail = 'existingUser@example.com';
      const expectedUser = UserData.find((user) => user.email === testEmail);

      const result = await UserRepo.findUserByEmail(testEmail);

      expect(result).toEqual(expectedUser);
    });

    it('should return undefined when no user with the given email exists', async () => {
      const testEmail = 'nonExistingUser@example.com';
      const result = await UserRepo.findUserByEmail(testEmail);

      expect(result).toBeUndefined();
    });
  });

  describe('findUserById', () => {
    it('should return a user object when a user with the given id exists', async () => {
      const testId = 1;
      const expectedUser = UserData.find((user) => user.id === testId);

      const result = await UserRepo.findUserById(testId);

      expect(result).toEqual(expectedUser);
    });

    it('should return undefined when no user with the given id exists', async () => {
      const testId = 9999;
      const result = await UserRepo.findUserById(testId);

      expect(result).toBeUndefined();
    });
  });
});
