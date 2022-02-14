import express from 'express';

import {
  addTransactionValidation,
  idValidation,
  queryValidations,
} from './validation';
import {
  getTransactions,
  createTransaction,
  removeTransaction,
} from '../../controllers/transactions/index';
import { guard } from '../../middlewares/guard';

const transactionsRouter = express.Router();

transactionsRouter.get('/', [guard, queryValidations], getTransactions);

transactionsRouter.post(
  '/',
  [guard, addTransactionValidation],
  createTransaction,
);

transactionsRouter.delete('/:id', [guard, idValidation], removeTransaction);

export default transactionsRouter;
