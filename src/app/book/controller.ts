import BookService from './service';
import logger from '../../config/logger';
import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/response';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  STATUS_CODE,
} from '../../utils/constant/options';

export default class BookController {
  /**
   * @static
   * @description The getBooksController used to get all books.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<Response>} The response object.
   */
  static async getBooksController(req: Request, res: Response) {
    const { page, limit } = req.query;

    // @ts-ignore
    const user = req.user;

    try {
      const response = await BookService.getBooksService(user, {
        page: isNaN(parseInt(page as string))
          ? DEFAULT_PAGE
          : parseInt(page as string),
        limit: isNaN(parseInt(limit as string))
          ? DEFAULT_LIMIT
          : parseInt(limit as string),
      });
      logger.info(
        `getBooksController -> response: ${JSON.stringify(response)}`
      );

      if (response.status !== STATUS_CODE.OK)
        return errorResponse(res, response.status, response.message);

      return successResponse(
        res,
        STATUS_CODE.OK,
        response.message,
        response.data
      );
    } catch (error) {
      logger.error(`getBooksController -> error: ${JSON.stringify(error)}`);
      return errorResponse(
        res,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        'An error occurred'
      );
    }
  }

  /**
   * @static
   * @description The addBookController used to add a book.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<Response>} The response object.
   */
  static async addBookController(req: Request, res: Response) {
    const { bookName, author, year } = req.body;

    try {
      const response = await BookService.addBookService({
        bookName,
        author,
        year,
      });
      logger.info(`addBookController -> response: ${JSON.stringify(response)}`);

      if (response.status !== STATUS_CODE.CREATED)
        return errorResponse(res, response.status, response.message);

      return successResponse(
        res,
        STATUS_CODE.CREATED,
        response.message,
        response.data
      );
    } catch (error) {
      logger.error(`addBookController -> error: ${JSON.stringify(error)}`);
      return errorResponse(
        res,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        'An error occurred'
      );
    }
  }

  /**
   * @static
   * @description The addBookController used to delete a book.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns {Promise<Response>} The response object.
   */
  static async deleteBookController(req: Request, res: Response) {
    const { bookName } = req.params;

    try {
      const response = await BookService.deleteBookService(bookName);
      logger.info(
        `deleteBookController -> response: ${JSON.stringify(response)}`
      );

      if (response.status !== STATUS_CODE.OK)
        return errorResponse(res, response.status, response.message);

      return successResponse(res, STATUS_CODE.OK, response.message);
    } catch (error) {
      logger.error(`deleteBookController -> error: ${JSON.stringify(error)}`);
      return errorResponse(
        res,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        'An error occurred'
      );
    }
  }
}
