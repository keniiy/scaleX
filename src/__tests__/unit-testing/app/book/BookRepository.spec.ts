import BookRepository from '../../../../repository/bookRepository';
import HelperFunctions from '../../../../utils/helperFunctions';

jest.mock('../../../../utils/helperFunctions');

describe('BookRepository', () => {
  const mockBooks = {
    data: [
      { bookName: 'Book 1', author: 'Author 1', year: 2020 },
      { bookName: 'Book 2', author: 'Author 2', year: 2021 },
    ],
    currentPage: 1,
    limit: 10,
    totalPages: 1,
    totalItems: 2,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsersBooks', () => {
    it('should return books for a regular user', async () => {
      jest.spyOn(HelperFunctions, 'readCsv').mockResolvedValue(mockBooks);

      const body = { page: 1, limit: 10 };
      const result = await BookRepository.getUsersBooks(body);

      expect(result).toEqual(mockBooks);
      expect(HelperFunctions.readCsv).toHaveBeenCalledWith(
        '../utils/data/csv/regularUser.csv',
        1,
        10
      );
    });
  });

  describe('getAdminBooks', () => {
    it('should return books for an admin user', async () => {
      jest.spyOn(HelperFunctions, 'readCsv').mockResolvedValue(mockBooks);

      const body = { page: 1, limit: 10 };
      const result = await BookRepository.getAdminBooks(body);

      expect(result).toEqual(mockBooks);
      expect(HelperFunctions.readCsv).toHaveBeenCalledWith(
        '../utils/data/csv/adminUser.csv',
        1,
        10
      );
    });
  });

  describe('addBook', () => {
    it('should add a book', async () => {
      const body = {
        bookName: 'Book 1',
        author: 'Author 1',
        year: '2020',
      };

      jest.spyOn(HelperFunctions, 'writeCsv').mockResolvedValue(true);

      const result = await BookRepository.addBook(body);

      expect(result).toEqual(true);

      expect(HelperFunctions.writeCsv).toHaveBeenCalledWith(
        '../utils/data/csv/regularUser.csv',
        body
      );

      expect(HelperFunctions.writeCsv).toHaveBeenCalledTimes(1);

      expect(HelperFunctions.writeCsv).toHaveReturnedTimes(1);

      expect(HelperFunctions.writeCsv).toHaveReturnedTimes(1);
    });
  });

  describe('bookExists', () => {
    it('should return true if the book exists', async () => {
      jest.spyOn(HelperFunctions, 'readCsv').mockResolvedValue(mockBooks);

      const bookName = 'Book 1';
      const exists = await BookRepository.bookExists(bookName);

      expect(exists).toBeTruthy();
    });

    it('should return false if the book does not exist', async () => {
      jest.spyOn(HelperFunctions, 'readCsv').mockResolvedValue(mockBooks);

      const bookName = 'Nonexistent Book';
      const exists = await BookRepository.bookExists(bookName);

      expect(exists).toBeFalsy();
    });
  });

  describe('bookExists', () => {
    it('should return true if the book exists', async () => {
      jest.spyOn(HelperFunctions, 'readCsv').mockResolvedValue(mockBooks);

      const bookName = 'Book 1';
      const exists = await BookRepository.bookExists(bookName);

      expect(exists).toBeTruthy();
    });

    it('should return false if the book does not exist', async () => {
      jest.spyOn(HelperFunctions, 'readCsv').mockResolvedValue(mockBooks);

      const bookName = 'Nonexistent Book';
      const exists = await BookRepository.bookExists(bookName);

      expect(exists).toBeFalsy();
    });
  });
});
