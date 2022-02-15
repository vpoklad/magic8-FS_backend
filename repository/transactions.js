// import UsersRepository from '../repository/user';
import Transaction from '../model/transaction';
import { getQueryParams, getPipeline } from '../services/transactions';
import mongoose from 'mongoose';
const { Types } = mongoose;

const transactionsList = async (userId, { limit = 50, skip = 0 }) => {
  const total = await Transaction.find({ owner: userId }).countDocuments();
  let transactions = Transaction.find({ owner: userId });

  const sortCriteria = { year: -1, month: -1, day: -1 };

  transactions = await transactions
    .skip(Number(skip))
    .limit(Number(limit))
    .sort(sortCriteria);
  return { total, transactions };
};

const removeTransaction = async (userId, transactionId) => {
  const transaction = await Transaction.findOneAndRemove({
    _id: transactionId,
    owner: userId,
  });
  return transaction;
};

const addTransaction = async (userId, body) => {
  const transaction = await Transaction.create({ ...body, owner: userId });
  return transaction;
};

// const updateTransaction = async userId => {
//   // const body = await Transaction.findOne({ category: 'salary', owner: userId });
//   const transaction = await Transaction.updateMany(
//     { category: 'bills', owner: userId },
//     { $set: { categoryLabel: `КОМУНАЛКА, ЗВ'ЯЗОК` } },
//     // { new: true },
//   );
//   return transaction;
// };

const getExpenseTransaction = async (id, dateQuery) => {
  const typeOfTransaction = false;
  const queryParams = await getQueryParams(id, dateQuery, typeOfTransaction);
  const pipelineToExpenses = getPipeline(queryParams);
  const expenses = await Transaction.aggregate(pipelineToExpenses);
  return expenses;
};

const getIncomeTransaction = async (id, dateQuery) => {
  const typeOfTransaction = true;
  const queryParams = await getQueryParams(id, dateQuery, typeOfTransaction);
  const pipelineToIncomes = getPipeline(queryParams);
  const incomes = await Transaction.aggregate(pipelineToIncomes);
  return incomes;
};

const getDetailedTransaction = async (id, body) => {
  const { year, month } = body;

  const totalExpInc = await Transaction.aggregate([
    {
      $match: {
        $and: [{ owner: Types.ObjectId(id) }, { year }, { month }],
      },
    },
    {
      $group: {
        _id: '$typeOfTransaction',
        total: { $sum: '$sum' },
      },
    },
    { $project: { total: { $round: ['$total', 2] } } },
    { $sort: { _id: 1 } },
  ]);

  const detailedCategoryStatistic = await Transaction.aggregate([
    {
      $match: {
        $and: [{ owner: Types.ObjectId(id) }, { year }, { month }],
      },
    },
    {
      $group: {
        _id: {
          typeOfTransaction: '$typeOfTransaction',
          category: '$category',
          categoryLabel: '$categoryLabel',
        },
        total: { $sum: '$sum' },
      },
    },
    { $project: { total: { $round: ['$total', 2] } } },
  ]);

  const detailedDescriptionStatistic = await Transaction.aggregate([
    {
      $match: {
        $and: [{ owner: Types.ObjectId(id) }, { year }, { month }],
      },
    },
    {
      $group: {
        _id: {
          typeOfTransaction: '$typeOfTransaction',
          description: '$description',
          category: '$category',
        },
        total: { $sum: '$sum' },
      },
    },
    { $project: { total: { $round: ['$total', 0] } } },
    { $sort: { total: -1 } },
  ]);

  return {
    totalExpInc,
    detailedCategoryStatistic,
    detailedDescriptionStatistic,
  };
};

export default {
  transactionsList,
  removeTransaction,
  addTransaction,
  // updateTransaction,
  getExpenseTransaction,
  getIncomeTransaction,
  getDetailedTransaction,
};
