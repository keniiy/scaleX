import BookController from '../../../../app/book/controller';
import BookService from '../../../../app/book/service';
import { Request, Response } from 'express';
import { mocked } from 'jest-mock';
import {
  STATUS_CODE,
  ERROR_RESPONSE_MESSAGE,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
} from '../../../../utils/constant/options';

jest.mock('../../../../app/book/service');

describe('BookController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBooksController', () => {
    it('should return success response with books data', async () => {
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

      const mockResponse = {
        message: 'Books fetched successfully',
        status: STATUS_CODE.OK,
        data: mockBooks,
      };

      mocked(BookService.getBooksService).mockResolvedValue(mockResponse);

      const req = {
        query: {},
        user: {
          id: 1,
          email: 'test@gmail.com',
          username: 'test',
          role: 'admin',
        },
      } as Partial<Request>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      await BookController.getBooksController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Books fetched successfully',
        data: mockBooks,
        status: 'success',
        statusCode: STATUS_CODE.OK,
      });
    });

    it('should return error response when an error occurs', async () => {
      mocked(BookService.getBooksService).mockRejectedValue(new Error());

      const req = {
        query: {},
        user: {
          id: 1,
          email: 'test@gmail.com',
          username: 'test',
          role: 'admin',
        },
      } as Partial<Request>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      await BookController.getBooksController(req as Request, res as Response);

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

  describe('addBookController', () => {
    it('should return success response with book data', async () => {
      const mockBook = {
        bookName: 'Book 1',
        author: 'Author 1',
        year: 2020,
      };

      const mockResponse = {
        message: 'Book added successfully',
        status: STATUS_CODE.CREATED,
        data: mockBook,
      };

      mocked(BookService.addBookService).mockResolvedValue(mockResponse);

      const req = {
        body: mockBook,
      } as Partial<Request>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      await BookController.addBookController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.CREATED);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Book added successfully',
        data: mockBook,
        status: 'success',
        statusCode: STATUS_CODE.CREATED,
      });
    });

    it('should return error if book already exists', async () => {
      const mockBook = {
        bookName: 'Book 1',
        author: 'Author 1',
        year: 2020,
      };

      const mockResponse = {
        message: 'Book already exists',
        status: STATUS_CODE.NOT_FOUND,
      };

      mocked(BookService.addBookService).mockResolvedValue(mockResponse);

      const req = {
        body: mockBook,
      } as Partial<Request>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      await BookController.addBookController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NOT_FOUND);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Book already exists',
        status: 'error',
        statusCode: STATUS_CODE.NOT_FOUND,
      });
    });

    it('should return error response when an error occurs', async () => {
      mocked(BookService.addBookService).mockRejectedValue(new Error());

      const req = {
        body: {
          bookName: 'Book 1',
          author: 'Author 1',
          year: 2020,
        },
      } as Partial<Request>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      await BookController.addBookController(req as Request, res as Response);

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

  describe('deleteBookController', () => {
    it('should return success response when book is deleted', async () => {
      const mockResponse = {
        message: 'Book deleted successfully',
        status: STATUS_CODE.OK,
      };

      mocked(BookService.deleteBookService).mockResolvedValue(mockResponse);

      const req = {
        params: {
          bookName: 'Book 1',
        },
      } as Partial<Request>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      await BookController.deleteBookController(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.OK);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Book deleted successfully',
        status: 'success',
        statusCode: STATUS_CODE.OK,
      });
    });

    it('should return error if book does not exist', async () => {
      const mockResponse = {
        message: 'Book does not exist',
        status: STATUS_CODE.BAD_REQUEST,
      };

      mocked(BookService.deleteBookService).mockResolvedValue(mockResponse);

      const req = {
        params: {
          bookName: 'Book 1',
        },
      } as Partial<Request>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      await BookController.deleteBookController(
        req as Request,
        res as Response
      );

      expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Book does not exist',
        status: 'error',
        statusCode: STATUS_CODE.BAD_REQUEST,
      });
    });

    it('should return error response when an error occurs', async () => {
      mocked(BookService.deleteBookService).mockRejectedValue(new Error());

      const req = {
        params: {
          bookName: 'Book 1',
        },
      } as Partial<Request>;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;

      await BookController.deleteBookController(
        req as Request,
        res as Response
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
