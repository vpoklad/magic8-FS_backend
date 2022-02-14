import Joi from 'joi';
import { HttpCode } from '../../lib/constants';

const addStatsSchema = Joi.object({
  year: Joi.number().required(),
  month: Joi.number().min(0).max(11).required(),
});

export const addStatsValidation = async (req, res, next) => {
  try {
    await addStatsSchema.validateAsync(req.query);
  } catch (error) {
    return res
      .status(HttpCode.BAD_REQUEST)
      .json({ message: `Field ${error.message.replace(/"/g, '')}` });
  }
  next();
};
