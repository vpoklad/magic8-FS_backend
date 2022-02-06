import Joi from 'joi';
import mongoose from 'mongoose';
const { Types } = mongoose;

const addTransactionSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  sum: Joi.string().required(),
  date: Joi.string().required(),
  typeOfTransaction: Joi.bool().required(),
});

// const patchingTransactionSchema = Joi.object({
//   name: Joi.string().optional(),
//   email: Joi.string().optional(),
//   phone: Joi.string().optional(),
//   favorite: Joi.bool().optional(),
// }).or('name', 'email', 'phone');

// const patchingTransactionFavoriteSchema = Joi.object({
//   favorite: Joi.bool().required(),
// });

const regLimit = /\d+/;

const queryParamsSchema = Joi.object({
  limit: Joi.string().pattern(regLimit).optional(),
  skip: Joi.number().min(0).optional(),
  sortBy: Joi.string()
    .valid('name', 'typeOfTransaction', 'category', 'date')
    .optional(),
  ortByDesc: Joi.string()
    .valid('name', 'typeOfTransaction', 'category', 'date')
    .optional(),
  filter: Joi.string()
    // eslint-disable-next-line prefer-regex-literals
    .pattern(
      new RegExp(
        '(name|typeOfTransaction|category|date)\\|?(name|typeOfTransaction|category|date)',
      ),
    )
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

// export const patchingTransactionValidation = async (req, res, next) => {
//   try {
//     await patchingTransactionSchema.validateAsync(req.body);
//   } catch (error) {
//     const [{ type }] = console.error.details;
//     if (type === 'object.missing') {
//       return res.status(400).json({ message: 'missing fields' });
//     }
//     return res.status(400).json({ message: error.message.replace(/"/g, '') });
//   }
//   next();
// };

export const idValidation = async (req, res, next) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ObjectId' });
  }
  next();
};

// export const patchingTransactionFavoriteValidation = async (req, res, next) => {
//   try {
//     await patchingTransactionFavoriteSchema.validateAsync(req.body);
//   } catch (error) {
//     const [{ type }] = console.error.details;
//     if (type === 'object.missing') {
//       return res.status(400).json({ message: 'missing field favorite' });
//     }
//     return res.status(400).json({ message: error.message.replace(/"/g, '') });
//   }
//   next();
// };

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
