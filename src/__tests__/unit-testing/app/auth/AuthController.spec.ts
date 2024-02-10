import AuthController from '../../../../app/auth/controller';
import AuthService from '../../../../app/auth/service';
import {
  STATUS_CODE,
  ERROR_RESPONSE_MESSAGE,
} from '../../../../utils/constant/options';
import { Request, Response } from 'express';
import { mocked } from 'jest-mock';

jest.mock('../../../../app/auth/service');

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginController', () => {
    it('should return success response when a user is logged in successfully', async () => {
      const mockResponse = {
        message: 'User login successful',
        status: STATUS_CODE.OK,
        data: {
          accessToken: 'mockAccessToken',
          user: {
            id: 1,
            email: 'test@example.com',
            role: 'user',
          },
        },
      };

      mocked(AuthService.loginService).mockResolvedValue(mockResponse);

      const req = {
        protocol: 'http',
        get: jest.fn(() => 'localhost'),
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      await AuthController.loginController(
        req as unknown as Request,
        res as unknown as Response
      );

      expect(AuthService.loginService).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User login successful',
        data: {
          accessToken: mockResponse.data.accessToken,
          user: {
            email: 'test@example.com',
            id: 1,
            role: 'user',
          },
        },
        status: 'success',
        statusCode: STATUS_CODE.OK,
      });
    });

    it('should return error response when invalid credentials are provided', async () => {
      const mockResponse = {
        message: 'Invalid credentials',
        status: STATUS_CODE.CONFLICT,
      };

      mocked(AuthService.loginService).mockResolvedValue(mockResponse);

      const req = {
        protocol: 'http',
        get: jest.fn(() => 'localhost'),
        body: {
          email: 'no@gmail.com',
          password: 'password',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      await AuthController.loginController(
        req as unknown as Request,
        res as unknown as Response
      );

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.CONFLICT);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid credentials',
        status: 'error',
        statusCode: STATUS_CODE.CONFLICT,
      });
    });

    it('should return error response when loginService throws an error', async () => {
      mocked(AuthService.loginService).mockRejectedValue(
        new Error('Test error')
      );

      const req = {
        protocol: 'http',
        get: jest.fn(() => 'localhost'),
        body: {
          email: 'test@gmail.com',
          password: 'password',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      await AuthController.loginController(
        req as unknown as Request,
        res as unknown as Response
      );

      expect(res.status).toHaveBeenCalledWith(
        STATUS_CODE.INTERNAL_SERVER_ERROR
      );
      expect(res.json).toHaveBeenCalledWith({
        message: ERROR_RESPONSE_MESSAGE,
        status: 'error',
        statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
      });
    });
  });
});
