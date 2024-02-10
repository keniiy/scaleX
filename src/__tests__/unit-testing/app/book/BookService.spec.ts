import BookService from '../../../../app/book/service';
import BookRepository from '../../../../repository/bookRepository';
import { STATUS_CODE, USER_TYPE } from '../../../../utils/constant/options';

jest.mock('../../../../repository/bookRepository');

describe('BookService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBooksService', () => {
    it('should retrieve books successfully for admin user', async () => {
      const mockBooks = {
        data: [
          { title: 'Book 1', author: 'Author 1', year: 2020 },
          { title: 'Book 2', author: 'Author 2', year: 2021 },
        ],
        currentPage: 1,
        limit: 10,
        totalPages: 1,
        totalItems: 2,
        hasNextPage: false,
        hasPreviousPage: false,
      };
      jest.spyOn(BookRepository, 'getAdminBooks').mockResolvedValue(mockBooks);

      const user = { role: USER_TYPE.ADMIN };
      const body = { page: 1, limit: 10 };

      const response = await BookService.getBooksService(user, body);

      expect(response).toEqual({
        message: 'Books retrieved successfully',
        status: STATUS_CODE.OK,
        data: mockBooks,
      });
      expect(BookRepository.getAdminBooks).toHaveBeenCalledWith(body);
    });

    it('should retrieve books successfully for user', async () => {
      const mockBooks = {
        data: [
          { title: 'Book 1', author: 'Author 1', year: 2020 },
          { title: 'Book 2', author: 'Author 2', year: 2021 },
        ],
        currentPage: 1,
        limit: 10,
        totalPages: 1,
        totalItems: 2,
        hasNextPage: false,
        hasPreviousPage: false,
      };
      jest.spyOn(BookRepository, 'getUsersBooks').mockResolvedValue(mockBooks);

      const user = { role: USER_TYPE.USER };
      const body = { page: 1, limit: 10 };

      const response = await BookService.getBooksService(user, body);

      expect(response).toEqual({
        message: 'Books retrieved successfully',
        status: STATUS_CODE.OK,
        data: mockBooks,
      });
      expect(BookRepository.getUsersBooks).toHaveBeenCalledWith(body);
    });

    it('should throw an error when an error occurs', async () => {
      jest
        .spyOn(BookRepository, 'getAdminBooks')
        .mockRejectedValue(new Error());

      const user = { role: USER_TYPE.ADMIN };
      const body = { page: 1, limit: 10 };

      await expect(BookService.getBooksService(user, body)).rejects.toThrow();
    });
  });

  describe('addBookService', () => {
    it('should add a book successfully', async () => {
      const mockBook = {
        bookName: 'Book 1',
        author: 'Author 1',
        year: 2020,
      };

      jest.spyOn(BookRepository, 'bookExists').mockResolvedValue(false);

      jest.spyOn(BookRepository, 'addBook').mockResolvedValue(mockBook);

      const body = {
        bookName: 'Book 1',
        author: 'Author 1',
        year: '2020',
      };

      const response = await BookService.addBookService(body);

      expect(response).toEqual({
        message: 'Book added successfully',
        status: 201,
        data: mockBook,
      });

      expect(BookRepository.bookExists).toHaveBeenCalledWith('Book 1');
      expect(BookRepository.addBook).toHaveBeenCalledWith(body);
    });

    it('should return book already exists message', async () => {
      jest.spyOn(BookRepository, 'bookExists').mockResolvedValue(true);

      const body = {
        bookName: 'Book 1',
        author: 'Author 1',
        year: '2020',
      };

      const response = await BookService.addBookService(body);

      expect(response).toEqual({
        message: 'Book already exists',
        status: STATUS_CODE.NOT_FOUND,
      });

      expect(BookRepository.bookExists).toHaveBeenCalledWith('Book 1');

      expect(BookRepository.addBook).not.toHaveBeenCalled();
    });

    it('should throw an error when an error occurs', async () => {
      jest.spyOn(BookRepository, 'bookExists').mockRejectedValue(new Error());

      const body = {
        bookName: 'Book 1',
        author: 'Author 1',
        year: '2020',
      };

      await expect(BookService.addBookService(body)).rejects.toThrow();
    });
  });

  describe('deleteBookService', () => {
    it('should delete a book successfully', async () => {
      jest.spyOn(BookRepository, 'bookExists').mockResolvedValue(true);

      jest.spyOn(BookRepository, 'deleteBook').mockResolvedValue(true);

      const bookName = 'Book 1';

      const response = await BookService.deleteBookService(bookName);

      expect(response).toEqual({
        data: true,
        message: 'Book deleted successfully',
        status: STATUS_CODE.OK,
      });

      expect(BookRepository.bookExists).toHaveBeenCalledWith('Book 1');
      expect(BookRepository.deleteBook).toHaveBeenCalledWith('Book 1');
    });

    it('should return book does not exist message', async () => {
      jest.spyOn(BookRepository, 'bookExists').mockResolvedValue(false);

      const bookName = 'Book 1';

      const response = await BookService.deleteBookService(bookName);

      expect(response).toEqual({
        message: 'Book does not exist',
        status: STATUS_CODE.NOT_FOUND,
      });

      expect(BookRepository.bookExists).toHaveBeenCalledWith('Book 1');

      expect(BookRepository.deleteBook).not.toHaveBeenCalled();
    });

    it('should throw an error when an error occurs', async () => {
      jest.spyOn(BookRepository, 'bookExists').mockRejectedValue(new Error());

      const bookName = 'Book 1';

      await expect(BookService.deleteBookService(bookName)).rejects.toThrow();
    });
  });
});
