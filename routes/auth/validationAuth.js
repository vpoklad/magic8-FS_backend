import Joi from 'joi';
import { HttpCode } from '../../lib/constants';

const addAuthSchema = Joi.object({
  // name: Joi.string().optional(),
  email: Joi.string().required(),
  password: Joi.string().optional(),
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
