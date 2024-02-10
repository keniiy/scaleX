import AuthService from '../../../../app/auth/service';
import UserRepo from '../../../../repository/userRepository';
import JwtToken from '../../../../utils/jwt/jwt';
import { STATUS_CODE } from '../../../../utils/constant/options';

jest.mock('../../../../repository/userRepository');
jest.mock('../../../../utils/jwt/jwt');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginService', () => {
    it('should login a user successfully', async () => {
      const user = {
        id: 1,
        username: 'test',
        email: 'test@gmail.com',
        password: 'password',
        role: 'user',
      };

      const mockResponse = {
        message: 'User login successful',
        status: STATUS_CODE.OK,
        data: {
          accessToken: 'mockAccessToken',
          user: {
            id: user.id,
            email: user.email,

            role: user.role,
          },
        },
      };

      jest.spyOn(UserRepo, 'findUserByEmail').mockResolvedValue(user);
      jest
        .spyOn(JwtToken, 'generateToken')
        .mockResolvedValue('mockAccessToken');

      const response = await AuthService.loginService({
        email: 'test@gmail.com',
        password: 'password',
      });

      expect(response).toEqual(mockResponse);
      expect(UserRepo.findUserByEmail).toHaveBeenCalledWith('test@gmail.com');
      expect(JwtToken.generateToken).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    });

    it('should return invalid credentials if user not found', async () => {
      jest.spyOn(UserRepo, 'findUserByEmail').mockResolvedValue(undefined);

      const response = await AuthService.loginService({
        email: 'wrong@gmail.com',
        password: 'password',
      });

      expect(response).toEqual({
        message: 'Invalid credentials',
        status: STATUS_CODE.CONFLICT,
      });
    });

    it('should return invalid credentials if password is incorrect', async () => {
      const user = {
        id: 1,
        email: 'test@gmail.com',
        password: 'correctPassword',
        role: 'user',
      };

      jest.spyOn(UserRepo, 'findUserByEmail').mockResolvedValue(undefined);

      const response = await AuthService.loginService({
        email: 'test@gmail.com',
        password: 'wrongPassword',
      });

      expect(response).toEqual({
        message: 'Invalid credentials',
        status: STATUS_CODE.CONFLICT,
      });
    });
  });
});
