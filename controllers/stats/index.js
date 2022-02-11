import repositoryTransactions from '../../repository/transactions';
import { HttpCode } from '../../lib/constants';

const getSummaryExpense = async (req, res, _next) => {
  // const { id } = req.params;
  // console.log('userId: ', id);
  // const { month } = req.body;
  const { id } = req.user;
  const data = await repositoryTransactions.getExpenseTransaction(id);
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
  // const { id } = req.params;
  // const { month } = req.body;
  const { id } = req.user;
  const data = await repositoryTransactions.getIncomeTransaction(id);
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

const getDetailedStatistic = async (req, res, next) => {
  const { id } = req.user;
  const body = req.body;
  const data = await repositoryTransactions.getDetailedTransaction(id, body);
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
