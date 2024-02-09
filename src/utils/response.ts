import { Response } from 'express';

export default class ApiResponse {
  /**
   * Returns a success response.
   * @static
   * @param res - The response object.
   * @param statusCode - The status code.
   * @param message - The success message.
   * @param data - The success data.
   * @returns The response object.
   */
  static successResponse(
    res: Response,
    statusCode: number,
    message: string,
    data?: any
  ) {
    return res
      .status(statusCode)
      .json({ status: 'success', statusCode, message, data });
  }

  /**
   * Returns an error response.
   * @static
   * @param res - The response object.
   * @param statusCode - The status code.
   * @param message - The error message.
   * @returns The response object.
   */
  static errorResponse(res: Response, statusCode: number, message: string) {
    return res
      .status(statusCode)
      .json({ status: 'error', statusCode, message });
  }
}

export const { successResponse, errorResponse } = ApiResponse;
