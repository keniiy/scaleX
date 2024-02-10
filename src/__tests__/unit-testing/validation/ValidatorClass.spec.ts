// Adjust the import paths according to your project's structure
import Validations from '../../../validation/validatorClass';
import { errorResponse } from '../../../utils/response';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

jest.mock('../../../utils/response', () => ({
  errorResponse: jest.fn(),
}));

describe('Validations Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it('should pass validation and call next function', () => {
    const schema = Joi.object({
      name: Joi.string().required(),
    });
    mockRequest = {
      body: {
        name: 'John Doe',
      },
    };

    const validatorMiddleware = Validations(schema);
    validatorMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
  });

  it('should fail validation and return an error response', () => {
    const schema = Joi.object({
      name: Joi.string().required(),
    });
    mockRequest = {
      body: {},
    };

    const validatorMiddleware = Validations(schema);
    validatorMiddleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(errorResponse).toHaveBeenCalledWith(
      mockResponse,
      expect.any(Number),
      expect.any(String)
    );
  });
});
