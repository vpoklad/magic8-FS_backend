import AuthService from '../../services/auth';
import repositoryTransactions from '../../repository/transactions';
import { HttpCode } from '../../lib/constants';

const getTransactions = async (req, res, _next) => {
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

const createTransaction = async (req, res, next) => {
  const { id: userId } = req.user;
  const body = req.body;
  const sumOfTransaction = Math.abs(body.sum);
  const balance = await AuthService.getBalance(userId);
  if (!body.typeOfTransaction && sumOfTransaction > balance) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: 'Transaction amount exceeds your balance',
    });
  }

  const newTransaction = await repositoryTransactions.addTransaction(
    userId,
    body,
  );
  if (newTransaction === null) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: 'missing required name field',
    });
  }

  !newTransaction.typeOfTransaction
    ? await AuthService.setBalance(userId, balance - sumOfTransaction)
    : await AuthService.setBalance(userId, balance + sumOfTransaction);

  const newBalance = await AuthService.getBalance(userId);

  const { total, transactions } = await repositoryTransactions.transactionsList(
    userId,
    req.query,
  );

  res.status(HttpCode.CREATED).json({
    status: 'success',
    code: HttpCode.OK,
    message: 'transaction created successful',
    data: { balance: newBalance, total, transactions },
  });
};

const removeTransaction = async (req, res, _next) => {
  const { id } = req.params;
  const { id: userId } = req.user;
  const transaction = await repositoryTransactions.removeTransaction(
    userId,
    id,
  );
  if (transaction === null) {
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  }

  const balance = await AuthService.getBalance(userId);
  const sumOfTransaction = Math.abs(transaction.sum);
  !transaction.typeOfTransaction
    ? await AuthService.setBalance(userId, balance + sumOfTransaction)
    : await AuthService.setBalance(userId, balance - sumOfTransaction);

  const newBalance = await AuthService.getBalance(userId);

  const { total, transactions } = await repositoryTransactions.transactionsList(
    userId,
    req.query,
  );

  res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    message: 'transaction deleted',
    data: { balance: newBalance, total, transactions },
  });
};

export { getTransactions, createTransaction, removeTransaction };
