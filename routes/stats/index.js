import { Router } from 'express';

import {
  getSummaryExpense,
  getSummaryIncome,
} from '../../controllers/stats/index';

//import { addUserValidation } from './validationUsers.js';
import { guard } from '../../middlewares/guard';

const statsRouter = new Router();

statsRouter.get('/expense/:id', guard, getSummaryExpense);
statsRouter.get('/income/:id', guard, getSummaryIncome);

export default statsRouter;
