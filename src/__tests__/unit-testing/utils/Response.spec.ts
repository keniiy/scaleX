import { Response } from 'express';
import ApiResponse from '../../../utils/response';

const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
} as Partial<Response>;

describe('ApiResponse', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('successResponse', () => {
    it('should send a success response with the correct status code and message', () => {
      const statusCode = 200;
      const message = 'Success message';
      const data = { key: 'value' };

      ApiResponse.successResponse(
        mockRes as Response,
        statusCode,
        message,
        data
      );

      expect(mockRes.status).toHaveBeenCalledWith(statusCode);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        statusCode,
        message,
        data,
      });
    });

    it('should send a success response without data if data is not provided', () => {
      const statusCode = 200;
      const message = 'Success message';

      ApiResponse.successResponse(mockRes as Response, statusCode, message);

      expect(mockRes.status).toHaveBeenCalledWith(statusCode);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'success',
        statusCode,
        message,
      });
    });
  });

  describe('errorResponse', () => {
    it('should send an error response with the correct status code and message', () => {
      const statusCode = 400;
      const message = 'Error message';

      ApiResponse.errorResponse(mockRes as Response, statusCode, message);

      expect(mockRes.status).toHaveBeenCalledWith(statusCode);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        statusCode,
        message,
      });
    });
  });
});
