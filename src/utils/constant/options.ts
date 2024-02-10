import { StatusCodes } from 'http-status-codes';

export const ERROR_RESPONSE_MESSAGE = 'Oops! Something went wrong';

export const STATUS_CODE = {
  OK: StatusCodes.OK,
  CREATED: StatusCodes.CREATED,
  BAD_REQUEST: StatusCodes.BAD_REQUEST,
  UNAUTHORIZED: StatusCodes.UNAUTHORIZED,
  FORBIDDEN: StatusCodes.FORBIDDEN,
  NOT_FOUND: StatusCodes.NOT_FOUND,
  CONFLICT: StatusCodes.CONFLICT,
  INTERNAL_SERVER_ERROR: StatusCodes.INTERNAL_SERVER_ERROR,
};

export const ADMIN = 'admin';
export const USER = 'user';

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

export const USER_TYPE = {
  ADMIN,
  USER,
};
