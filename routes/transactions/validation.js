import Joi from 'joi';
import mongoose from 'mongoose';
const { Types } = mongoose;

const addTransactionSchema = Joi.object({
  description: Joi.string().required(),
  category: Joi.string().required(),
  sum: Joi.number().precision(2).required(),
  date: Joi.string().required(),
  year: Joi.number().required(),
  month: Joi.number().required(),
  day: Joi.number().required(),
  typeOfTransaction: Joi.bool().required(),
  categoryLabel: Joi.string().required(),
});

const regLimit = /\d+/;

const queryParamsSchema = Joi.object({
  day: Joi.string().pattern(regLimit).optional(),
  limit: Joi.string().pattern(regLimit).optional(),
  skip: Joi.number().min(0).optional(),
  sortBy: Joi.string().valid('date', 'year', 'month').optional(),
  sortByDesc: Joi.string().valid('date', 'year', 'month').optional(),
  filter: Joi.string()
    // eslint-disable-next-line prefer-regex-literals
    .pattern(new RegExp('(date|year|month)\\|?(date|year|month)'))
    .optional(),
});

export const addTransactionValidation = async (req, res, next) => {
  try {
    await addTransactionSchema.validateAsync(req.body);
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Field ${error.message.replace(/"/g, '')}` });
  }
  next();
};

export const idValidation = async (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ObjectId' });
  }
  next();
};

export const queryValidations = async (req, res, next) => {
  try {
    await queryParamsSchema.validateAsync(req.query);
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Field ${error.message.replace(/"/g, '')}` });
  }
  next();
};
