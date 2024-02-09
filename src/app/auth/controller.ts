import AuthService from './service';
import logger from '../../config/logger';
import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/response';
import { STATUS_CODE } from '../../utils/constant/options';

export default class AuthController {
  /**
   * @static
   * @description The login controller used to login a user.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<Response>} The response object.
   */
  static async loginController(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const response = await AuthService.loginService({ email, password });
      logger.info(`loginController -> response: ${JSON.stringify(response)}`);

      if (response.status !== STATUS_CODE.OK)
        return errorResponse(res, response.status, response.message);

      return successResponse(
        res,
        STATUS_CODE.OK,
        response.message,
        response.data
      );
    } catch (error) {
      logger.error(`loginController -> error: ${JSON.stringify(error)}`);
      return errorResponse(
        res,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        'An error occurred'
      );
    }
  }
}
