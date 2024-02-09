import Joi from 'joi';

export const getBookSchema = Joi.object({
  page: Joi.number().default(1),
  limit: Joi.number().default(10),
});

export const addBookSchema = Joi.object({
  bookName: Joi.string().required(),
  author: Joi.string().required(),
  year: Joi.string()
    .pattern(/^[0-9]{4}$/)
    .required(),
});
