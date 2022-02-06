import repositoryTransactions from '../../repository/transactions';
import { HttpCode } from '../../lib/constants';

const getTransactions = async (req, res, next) => {
  const { id: userId } = req.user;
  const transactions = await repositoryTransactions.transactionsList(
    userId,
    req.query,
  );
  if (!transactions) {
    res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found transactions',
    });
  }
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: transactions });
};

// const getTransactionById = async (req, res, next) => {
//   const { id } = req.params;
//   const { id: userId } = req.user;
//   const transaction = await repositoryTransactions.getTransactionById(
//     userId,
//     id
//   );
//   if (!transaction) {
//     res.status(HttpCode.NOT_FOUND).json({
//       status: "error",
//       code: HttpCode.NOT_FOUND,
//       message: "Not found",
//     });
//   }
//   res
//     .status(200)
//     .json({ status: "success", code: HttpCode.OK, data: { transaction } });
// };

const createTransaction = async (req, res, next) => {
  const { id: userId } = req.user;
  const newTransaction = await repositoryTransactions.addTransaction(
    userId,
    req.body,
  );
  if (newTransaction === null) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: 'missing required name field',
    });
  }
  res.status(HttpCode.CREATED).json({
    status: 'success',
    code: HttpCode.OK,
    data: { transaction: newTransaction },
  });
};

const removeTransaction = async (req, res, next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const transactions = await repositoryTransactions.removeTransaction(
    userId,
    id,
  );
  if (transactions === null) {
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  }

  res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    message: 'transaction deleted',
  });
};

// const updateTransaction = async (req, res, next) => {
//   const { id } = req.params;
//   const { id: userId } = req.user;
//   const transaction = await repositoryTransactions.updateTransaction(
//     userId,
//     id,
//     req.body
//   );
//   if (!transaction) {
//     return res.status(HttpCode.NOT_FOUND).json({
//       status: "error",
//       code: HttpCode.NOT_FOUND,
//       message: "Not found",
//     });
//   }
//   return res
//     .status(HttpCode.OK)
//     .json({ status: "success", code: HttpCode.OK, data: { transaction } });
// };

export {
  getTransactions,
  // getTransactionById,
  createTransaction,
  removeTransaction,
  // updateTransaction,
};
