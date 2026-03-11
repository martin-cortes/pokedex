import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGO_CONNECTION: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  PORT: Joi.number().optional(),
  LOCAL_PORT: Joi.number().default(3000),
  DEFAULT_LIMIT: Joi.number().default(5),
});
