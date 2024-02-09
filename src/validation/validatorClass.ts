import { errorResponse } from '../utils/response';
import { STATUS_CODE } from '../utils/constant/options';
import logger from '../config/logger';
import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

class Validations {
  static validateInput(
    schema: Joi.Schema,
    object: any
  ): { error?: Joi.ValidationError; value?: any } {
    const { error, value } = schema.validate(object);
    return { error, value };
  }

  static validate(schema: Joi.Schema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = Validations.validateInput(schema, {
        ...req.body,
        ...req.query,
        ...req.params,
      });
      if (!error) {
        return next();
      }
      logger.error(`Validation error: ${error.details[0].message}`);
      errorResponse(res, STATUS_CODE.BAD_REQUEST, error.details[0].message);
    };
  }
}

export default Validations.validate;
