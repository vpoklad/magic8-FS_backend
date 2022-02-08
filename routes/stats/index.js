import { Router } from 'express';

import {
  getSummaryExpense,
  getSummaryIncome,
} from '../../controllers/stats/index';

//import { addUserValidation } from './validationUsers.js';
import { guard } from '../../middlewares/guard';

const statsRouter = new Router();

statsRouter.get('/expense/', guard, getSummaryExpense);
statsRouter.get('/income/', guard, getSummaryIncome);

export default statsRouter;
