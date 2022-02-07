import repositoryTransactions from '../../repository/transactions';
import { HttpCode } from '../../lib/constants';

const getSummaryExpense = async (req, res, _next) => {
  const { id } = req.params;
  console.log('userId: ', id);
  // const { id: userId } = req.user;
  // const { month } = req.body;
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
  const { id } = req.params;
  // const { id: userId } = req.user;
  const { month } = req.body;
  const data = await repositoryTransactions.getIncomeTransaction(id, month);
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

export { getSummaryExpense, getSummaryIncome };
