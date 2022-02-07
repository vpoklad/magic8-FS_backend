// import Joi from 'joi';
// import { HttpCode } from '../../lib/constants';

// const addStatsSchema = Joi.object({
//   name: Joi.string().optional(),
//   email: Joi.string().required(),
//   password: Joi.string().optional(),
// });

// export const addStatsValidation = async (req, res, next) => {
//   try {
//     await addStatsSchema.validateAsync(req.body);
//   } catch (error) {
//     return res
//       .status(HttpCode.BAD_REQUEST)
//       .json({ message: `Field ${error.message.replace(/"/g, '')}` });
//   }
//   next();
// };
