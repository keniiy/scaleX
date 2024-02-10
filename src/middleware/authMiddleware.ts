import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';
import { USER_TYPE, STATUS_CODE, ADMIN, USER } from '../utils/constant/options';
import { RequestWithUser } from '../utils/constant/types';
import logger from '../config/logger';
import JwtToken from '../utils/jwt/jwt';
import UserRepo from '../repository/userRepository';

export default class AuthenticationMiddleware {
  static async isUserAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const authorization = req.headers.authorization;
      if (!authorization)
        return errorResponse(res, STATUS_CODE.UNAUTHORIZED, 'Token required');

      const token = await JwtToken.verifyToken(authorization.substring(7));

      if (!token)
        return errorResponse(res, STATUS_CODE.UNAUTHORIZED, 'Invalid token');

      const user = await UserRepo.findUserById(token.id);
      if (!user) {
        return errorResponse(
          res,
          STATUS_CODE.UNAUTHORIZED,
          'Invalid user token'
        );
      }

      // @ts-ignore
      req.user = user;

      return next();
    } catch (err) {
      logger.error(`isUserAuthenticated -> error: ${JSON.stringify(err)}`);
      return errorResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        'Invalid Or Expired Token'
      );
    }
  }

  static isAllowedToAccessRoute(
    allowedRoles: Array<typeof ADMIN | typeof USER>
  ) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const requestWithUser = req as unknown as RequestWithUser; // Safely cast the type

      if (
        !requestWithUser.user ||
        !allowedRoles.includes(
          requestWithUser.user.role as typeof ADMIN | typeof USER
        )
      ) {
        errorResponse(
          res,
          STATUS_CODE.FORBIDDEN,
          'Access denied. You are unauthorized'
        );
        return;
      }
      next();
    };
  }
}
