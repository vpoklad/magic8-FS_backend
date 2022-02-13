import Transaction from '../model/transaction';
import mongoose from 'mongoose';
const { Types } = mongoose;

const transactionsList = async (
  userId,
  { sortBy, sortByDesc, filter, limit = 10, skip = 0 },
) => {
  let sortCriteria = null;
  const total = await Transaction.find({ owner: userId }).countDocuments();
  let transactions = Transaction.find({ owner: userId }).populate({
    path: 'owner',
    select: 'name email role',
  });
  if (sortBy) {
    sortCriteria = { [`${sortBy}`]: 1 };
  }
  if (sortByDesc) {
    sortCriteria = { [`${sortByDesc}`]: -1 };
  }
  if (filter) {
    transactions = transactions.select(filter.split('|').join(' '));
  }
  transactions = await transactions
    .skip(Number(skip))
    .limit(Number(limit))
    .sort(sortCriteria);
  return { total, transactions };
};

// const getTransactionById = async (userId, transactionId) => {
//   const transaction = await Transaction.findOne({
//     _id: transactionId,
//     owner: userId,
//   })
//   // .populate({
//   //   path: "owner",
//   //   select: "name email role",
//   // });
//   return transaction;
// };

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

const getExpenseTransaction = async (id, body) => {
  const { year, month } = body;
  const minMonth = Math.max(0, month - 5);
  const expenses = await Transaction.aggregate([
    {
      $match: {
        $and: [
          { owner: Types.ObjectId(id) },
          { typeOfTransaction: false },
          { year },
          { month: { $gte: minMonth, $lte: month } },
        ],
      },
    },
    { $group: { _id: '$month', totalExpense: { $sum: '$sum' } } },
    { $project: { totalExpense: { $round: ['$totalExpense', 2] } } },
    { $sort: { _id: -1 } },
  ]);
  return expenses;
};

const getIncomeTransaction = async (id, body) => {
  const { year, month } = body;
  const minMonth = Math.max(0, month - 5);
  const incomes = await Transaction.aggregate([
    {
      $match: {
        $and: [
          { owner: Types.ObjectId(id) },
          { typeOfTransaction: true },
          { year },
          { month: { $gte: minMonth, $lte: month } },
        ],
      },
    },
    { $group: { _id: '$month', totalIncome: { $sum: '$sum' } } },
    { $project: { totalIncome: { $round: ['$totalIncome', 2] } } },
    { $sort: { _id: -1 } },
  ]);
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
    { $project: { total: { $round: ['$total', 2] } } },
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
  // getTransactionById,
  removeTransaction,
  addTransaction,
  // updateTransaction,
  getExpenseTransaction,
  getIncomeTransaction,
  getDetailedTransaction,
};
