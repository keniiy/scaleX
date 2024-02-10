import AuthenticationMiddleware from '../../../middleware/authMiddleware';
import JwtToken from '../../../utils/jwt/jwt';
import UserRepo from '../../../repository/userRepository';
import { errorResponse } from '../../../utils/response';
import { STATUS_CODE, ADMIN } from '../../../utils/constant/options';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../../utils/jwt/jwt');
jest.mock('../../../repository/userRepository');
jest.mock('../../../utils/response');

describe('AuthenticationMiddleware', () => {
  describe('isUserAuthenticated', () => {
    const mockReq: Partial<Request> = {
      headers: {
        authorization: 'Bearer token123',
      },
      get: jest.fn().mockReturnValue('localhost'),
    };

    const mockRes: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const nextFunction: NextFunction = jest.fn();

    it('should call next function for valid token and user', async () => {
      const mockReq: Partial<Request> = {
        headers: {
          authorization: 'Bearer token123',
        },
        get: jest.fn().mockReturnValue('localhost') as {
          (name: 'set-cookie'): string[] | undefined;
          (name: string): string | undefined;
        },
      };

      const mockRes: Partial<Response<any, Record<string, any>>> = {
        status: jest.fn().mockReturnThis() as (
          code: number
        ) => Response<any, Record<string, any>>,
        json: jest.fn(),
      };

      (JwtToken.verifyToken as jest.Mock).mockResolvedValue({ id: 1 });
      (UserRepo.findUserById as jest.Mock).mockResolvedValue({
        id: 1,
        role: 'USER',
      });

      await AuthenticationMiddleware.isUserAuthenticated(
        mockReq as Request,
        mockRes as Response<any, Record<string, any>>,
        nextFunction
      );

      expect(JwtToken.verifyToken).toHaveBeenCalledWith('token123');
      expect(UserRepo.findUserById).toHaveBeenCalledWith(1);
      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return an error response if token is missing', async () => {
      const reqWithoutToken = {
        headers: {},
      } as unknown as Request;

      await AuthenticationMiddleware.isUserAuthenticated(
        reqWithoutToken,
        mockRes as Response,
        nextFunction
      );

      expect(errorResponse).toHaveBeenCalledWith(
        mockRes,
        STATUS_CODE.UNAUTHORIZED,
        'Token required'
      );
    });
  });

  describe('isAllowedToAccessRoute', () => {
    it('should call next function if user has allowed role', () => {
      const middleware = AuthenticationMiddleware.isAllowedToAccessRoute([
        ADMIN,
      ]);

      // Mock request with user having an ADMIN role
      const mockReq = {
        user: {
          role: ADMIN,
        },
      } as Partial<Request>;

      // Mock response object
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      const nextFunction: NextFunction = jest.fn();

      middleware(mockReq as Request, mockRes as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
    });

    it('should return an error response if user role is not allowed', () => {
      const middleware = AuthenticationMiddleware.isAllowedToAccessRoute([
        ADMIN,
      ]);

      const mockReq = {
        user: {
          role: 'USER',
        },
      } as unknown as Request;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      const nextFunction: NextFunction = jest.fn();

      middleware(mockReq, mockRes, nextFunction);

      expect(errorResponse).toHaveBeenCalledWith(
        mockRes,
        STATUS_CODE.FORBIDDEN,
        'Access denied. You are unauthorized'
      );
    });
  });
});
