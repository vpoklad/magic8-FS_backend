import Joi from 'joi';
import { HttpCode } from '../../lib/constants';

const addAuthSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(40)
    .pattern(/^[A-z]+(?:\s+[A-z]+)*$|^[А-я]+(?:\s+[А-я]+)*$/)
    .default('Guest')
    .optional(),
  email: Joi.string()
    .trim()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua'] } })
    .required(),
  password: Joi.string().min(6).max(30).optional(),
});

export const addAuthValidation = async (req, res, next) => {
  try {
    await addAuthSchema.validateAsync(req.body);
  } catch (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ message: `Field ${error.message.replace(/"/g, '')}` });
  }
  next();
};

const addBalanceSchema = Joi.object({
  balance: Joi.number().precision(2).greater(-0.01).required(),
});

export const addBalanceValidation = async (req, res, next) => {
  try {
    await addBalanceSchema.validateAsync(req.body);
  } catch (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ message: `Field ${error.message.replace(/"/g, '')}` });
  }
  next();
};
