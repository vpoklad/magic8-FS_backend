import Transaction from "../model/transaction";

const transactionsList = async (
  userId,
  { sortBy, sortByDesc, filter, limit = 10, skip = 0 }
) => {
  let sortCriteria = null;
  const total = await Transaction.find({ owner: userId }).countDocuments();
  let transactions = Transaction.find({ owner: userId }).populate({
    path: "owner",
    select: "name email role",
  });
  if (sortBy) {
    sortCriteria = { [`${sortBy}`]: 1 };
  }
  if (sortByDesc) {
    sortCriteria = { [`${sortByDesc}`]: -1 };
  }
  if (filter) {
    transactions = transactions.select(filter.split("|").join(" "));
  }
  transactions = await transactions
    .skip(Number(skip))
    .limit(Number(limit))
    .sort(sortCriteria);
  return { total, transactions };
};

const getTransactionById = async (userId, transactionId) => {
  const transaction = await Transaction.findOne({
    _id: transactionId,
    owner: userId,
  }).populate({
    path: "owner",
    select: "name email role",
  });
  return transaction;
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

const updateTransaction = async (userId, transactionId, body) => {
  const transaction = await Transaction.findOneAndUpdate(
    { _id: transactionId, owner: userId },
    { ...body },
    { new: true }
  );
  return transaction;
};

export default {
  transactionsList,
  getTransactionById,
  removeTransaction,
  addTransaction,
  updateTransaction,
};
