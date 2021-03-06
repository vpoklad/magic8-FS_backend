import Transaction from '../model/transaction';
import TransactionsService from '../services/transactions';

const transactionsList = async (userId, { limit = 20, skip = 0 }) => {
  const total = await Transaction.find({ owner: userId }).countDocuments();
  let transactions = Transaction.find({ owner: userId });

  const sortCriteria = { year: -1, month: -1, day: -1, createdAt: -1 };

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

const getExpenseTransaction = async (id, query) => {
  const typeOfTransaction = false;
  const transactionsService = new TransactionsService(
    id,
    query,
    Transaction,
    typeOfTransaction,
  );
  return await transactionsService.statisticSummery();
};

const getIncomeTransaction = async (id, query) => {
  const typeOfTransaction = true;
  const transactionsService = new TransactionsService(
    id,
    query,
    Transaction,
    typeOfTransaction,
  );

  return await transactionsService.statisticSummery();
};

const getDetailedTransaction = async (id, query) => {
  const transactionsService = new TransactionsService(id, query, Transaction);

  const totalExpInc = await transactionsService.totalExpInc();
  const detailedCategoryStatistic =
    await transactionsService.detailedCategoryStatistic();
  const detailedDescriptionStatistic =
    await transactionsService.detailedDescriptionStatistic();
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
  getExpenseTransaction,
  getIncomeTransaction,
  getDetailedTransaction,
};
