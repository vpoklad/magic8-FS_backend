import { Router } from 'express';

import {
  registration,
  login,
  logout,
  getCurrent,
  updateBalance,
  // getBalance,
  googleAuth,
  googleRedirect,
  verifyUser,
  repeatEmailForVerifyUser,
} from '../../controllers/auth/index';
import { addAuthValidation, addBalanceValidation } from './validationAuth';
import { guard } from '../../middlewares/guard';

const authRouter = new Router();

authRouter.post('/registration', addAuthValidation, registration);
authRouter.get('/google', googleAuth);
authRouter.get('/google-redirect', googleRedirect);
authRouter.post('/login', addAuthValidation, login);
authRouter.post('/logout', guard, logout);
authRouter.get('/current', guard, getCurrent);
authRouter.patch('/balance', guard, updateBalance);
// authRouter.get('/balance', guard, getBalance);
authRouter.get('/verify/:verificationToken', verifyUser);
authRouter.post('/verify', repeatEmailForVerifyUser);

export default authRouter;
