import UserRepo from '../../repository/userRepository';
import logger from '../../config/logger';
import { STATUS_CODE } from '../../utils/constant/options';
import JwtToken from '../../utils/jwt/jwt';

export default class AuthService {
  /**
   * @description This method is used to login a user
   * @param {object} body - The request body
   * @returns {object} - The response object
   */
  static async loginService(body: { email: string; password: string }) {
    try {
      const { email, password } = body;
      const user = await UserRepo.findUserByEmail(email);

      if (!user)
        return {
          message: 'Invalid credentials',
          status: STATUS_CODE.CONFLICT,
        };

      if (user.password !== password)
        return {
          message: 'Invalid credentials',
          status: STATUS_CODE.CONFLICT,
        };

      const accessToken = await JwtToken.generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      logger.info(`loginService -> accessToken: ${accessToken}`);

      return {
        message:
          user.role === 'admin'
            ? 'Admin login successful'
            : 'User login successful',
        status: STATUS_CODE.OK,
        data: {
          accessToken,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        },
      };
    } catch (error) {
      logger.error(`loginService -> error: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
