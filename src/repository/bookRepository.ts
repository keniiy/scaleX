import HelperFunctions from '../utils/helperFunctions';

const adminUserCsvPath = '../utils/data/csv/adminUser.csv';
const regularUserCsvPath = '../utils/data/csv/regularUser.csv';

export default class BookRepository {
  /**
   * @static
   * @description This method is used to get all books for a user
   * @param {object} body - The request body
   * @returns {object} - The response object
   */
  static async getUsersBooks(body: { page: number; limit: number }) {
    const { page, limit } = body;
    return await HelperFunctions.readCsv(regularUserCsvPath, page, limit);
  }

  /**
   * @static
   * @description This method is used to get all books for an admin
   * @param {object} body - The request body
   * @returns {object} - The response object
   */
  static async getAdminBooks(body: { page: number; limit: number }) {
    const { page, limit } = body;

    return await HelperFunctions.readCsv(adminUserCsvPath, page, limit);
  }

  /**
   * @static
   * @description This method is used to add a book
   * @param {object} body - The request body
   * @returns {object} - The response object
   */
  static async addBook(body: {
    bookName: string;
    author: string;
    year: string;
  }) {
    return await HelperFunctions.writeCsv(regularUserCsvPath, body);
  }

  /**
   * @static
   * @description This method is to find if a book exists
   * @param {string} bookName - The book name
   * @returns {boolean} - The response object
   */
  static async bookExists(bookName: string) {
    const books = await HelperFunctions.readCsv(regularUserCsvPath, 1, 100);

    return books.data.some(
      (book: any) => book.bookName.toLowerCase() === bookName.toLowerCase()
    );
  }

  /**
   * @static
   * @description This method is to delete a book
   * @param {string} bookName - The book name
   * @returns {object} - The response object
   */
  static async deleteBook(bookName: string) {
    const books = await HelperFunctions.deleteRowFromCsv(
      regularUserCsvPath,
      bookName
    );

    return books;
  }
}
