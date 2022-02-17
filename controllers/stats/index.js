import repositoryTransactions from '../../repository/transactions';
import { HttpCode } from '../../lib/constants';

const getSummaryExpense = async (req, res, _next) => {
  const { id } = req.user;
  const { year, month } = req.query;
  const data = await repositoryTransactions.getExpenseTransaction(id, {
    year: Number(year),
    month: Number(month),
  });
  if (!data) {
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  }
  return res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data });
};

const getSummaryIncome = async (req, res, _next) => {
  const { id } = req.user;
  const { year, month } = req.query;
  const data = await repositoryTransactions.getIncomeTransaction(id, {
    year: Number(year),
    month: Number(month),
  });
  if (!data) {
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found ',
    });
  }
  return res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data });
};

const getDetailedStatistic = async (req, res, next) => {
  const { id } = req.user;
  const { year, month } = req.query;
  const data = await repositoryTransactions.getDetailedTransaction(id, {
    year: Number(year),
    month: Number(month),
  });
  if (!data) {
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found',
    });
  }
  return res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data });
};

export { getSummaryExpense, getSummaryIncome, getDetailedStatistic };
