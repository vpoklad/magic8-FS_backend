import months from '../../lib/months';
import UsersRepository from '../../repository/user';
import mongoose from 'mongoose';
const { Types } = mongoose;

const getMinMonth = (dateUserCreated, dateQuery) => {
  const { year, month } = dateQuery;
  const yearReg = Number(dateUserCreated.getFullYear());
  const monthReg = Number(dateUserCreated.getMonth()) - 1;
  const minM = yearReg === year ? monthReg : 0;
  const minMonth = Math.max(minM, month - 5);
  //   const minMonth = Math.max(0, month - 5);
  return minMonth;
};

const getQueryParams = async (id, dateQuery, typeOfTransaction) => {
  const { year, month } = dateQuery;
  const owner = Types.ObjectId(id);
  const user = await UsersRepository.findById(owner);
  const dateUserCreated = user.createdAt;
  const minMonth = getMinMonth(dateUserCreated, dateQuery);
  return {
    owner,
    typeOfTransaction,
    year,
    minMonth,
    month,
  };
};

const getPipeline = queryParams => {
  const { owner, typeOfTransaction, year, minMonth, month } = queryParams;
  const total = typeOfTransaction ? 'totalIncome' : 'totalExpense';
  const pipeline = [
    {
      $match: {
        $and: [
          { owner },
          { typeOfTransaction },
          { year },
          { month: { $gte: minMonth, $lte: month } },
        ],
      },
    },
    { $group: { _id: '$month', [`${total}`]: { $sum: '$sum' } } },
    {
      $project: {
        month: { $arrayElemAt: [months, '$_id'] },
        [`${total}`]: { $round: [`$${total}`, 2] },
      },
    },
    { $sort: { _id: -1 } },
  ];
  return pipeline;
};

export { getMinMonth, getQueryParams, getPipeline };
