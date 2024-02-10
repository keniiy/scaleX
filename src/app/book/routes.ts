import express from 'express';
import { getBookSchema, addBookSchema } from './validation';
import BookController from './controller';
import validate from '../../validation/validatorClass';
import AuthenticationMiddleware from '../../middleware/authMiddleware';
import { ADMIN } from '../../utils/constant/options';

const router = express.Router();

router.get(
  '/home',
  AuthenticationMiddleware.isUserAuthenticated,
  validate(getBookSchema),
  BookController.getBooksController
);

router.post(
  '/addBook',
  AuthenticationMiddleware.isUserAuthenticated,
  validate(addBookSchema),
  AuthenticationMiddleware.isAllowedToAccessRoute([ADMIN]),
  BookController.addBookController
);

router.delete(
  '/deleteBook/:bookName',
  AuthenticationMiddleware.isUserAuthenticated,
  AuthenticationMiddleware.isAllowedToAccessRoute([ADMIN]),
  BookController.deleteBookController
);

export default router;
