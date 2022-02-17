import { Router } from 'express';

import {
  getSummaryExpense,
  getSummaryIncome,
  getDetailedStatistic,
} from '../../controllers/stats/index';
import { addStatsValidation } from './validationStats';
import { guard } from '../../middlewares/guard';

const statsRouter = new Router();

statsRouter.get('/expense', guard, addStatsValidation, getSummaryExpense);
statsRouter.get('/income', guard, addStatsValidation, getSummaryIncome);
statsRouter.get('/detailed', guard, addStatsValidation, getDetailedStatistic);

export default statsRouter;
