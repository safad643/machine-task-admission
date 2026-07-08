import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  MONGODB_URI: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(16).required(),
  PORT: Joi.number().port().default(5000),
  CORS_ORIGIN: Joi.string().uri().default('http://localhost:3000'),
  COOKIE_SECURE: Joi.boolean().default(false),
  COOKIE_SAMESITE: Joi.string().valid('lax', 'strict', 'none').default('lax'),
});
