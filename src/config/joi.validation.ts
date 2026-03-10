import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    MONGO_CONNECTION: Joi.required(),
    DATABASE_NAME: Joi.required(),
    PORT: Joi.number().default(3000),
    DEFAULT_LIMIT: Joi.number().default(5)
})