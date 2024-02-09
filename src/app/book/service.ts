import BookRepository from '../../repository/bookRepository';
import logger from '../../config/logger';
import { STATUS_CODE, USER_TYPE } from '../../utils/constant/options';
import JwtToken from '../../utils/jwt/jwt';

export default class BookService {
  /**
   * @description This method is used to login a user
   * @param {object} user - The user object
   * @param {object} body - The request body
   * @returns {object} - The response object
   */
  static async getBooksService(
    user: any,
    body: { page: number; limit: number }
  ) {
    try {
      console.log('user', user);
      const books =
        user.role === USER_TYPE.ADMIN
          ? await BookRepository.getAdminBooks(body)
          : await BookRepository.getUsersBooks(body);

      logger.info(`getBooksService -> books: ${JSON.stringify(books)}`);

      return {
        message: 'Books retrieved successfully',
        status: STATUS_CODE.OK,
        data: books,
      };
    } catch (error: any) {
      logger.error(`loginService -> error: ${JSON.stringify(error.message)}`);
      throw error;
    }
  }

  /**
   * @description This method is used to add a book
   * @param {object} user - The user object
   * @param {object} body - The request body
   * @returns {object} - The response object
   */
  static async addBookService(body: {
    bookName: string;
    author: string;
    year: string;
  }) {
    try {
      const bookExists = await BookRepository.bookExists(body.bookName);

      console.log('bookExists', bookExists);

      if (bookExists) {
        return {
          message: 'Book already exists',
          status: STATUS_CODE.NOT_FOUND,
        };
      }
      const book = await BookRepository.addBook(body);

      logger.info(`addBookService -> book: ${JSON.stringify(book)}`);

      return {
        message: 'Book added successfully',
        status: 201,
        data: book,
      };
    } catch (error: any) {
      logger.error(`addBookService -> error: ${JSON.stringify(error.message)}`);
      throw error;
    }
  }

  /**
   * @description This method is used to delete a book
   * @param {object} user - The user object
   * @param {object} body - The request body
   * @returns {object} - The response object
   */
  static async deleteBookService(bookName: string) {
    try {
      const bookExists = await BookRepository.bookExists(bookName);

      if (!bookExists) {
        return {
          message: 'Book does not exist',
          status: 400,
        };
      }
      const book = await BookRepository.deleteBook(bookName);

      logger.info(`deleteBookService -> book: ${JSON.stringify(book)}`);

      return {
        message: 'Book deleted successfully',
        status: 200,
        data: book,
      };
    } catch (error: any) {
      logger.error(
        `deleteBookService -> error: ${JSON.stringify(error.message)}`
      );
      throw error;
    }
  }
}
