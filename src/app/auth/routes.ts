import express from 'express';
import { loginSchema } from './validation';
import AuthController from './controller';
import validate from '../../validation/validatorClass';

const router = express.Router();

router.post('/login', validate(loginSchema), AuthController.loginController);

export default router;
