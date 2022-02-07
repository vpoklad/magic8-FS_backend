import { Router } from 'express';

import {
  registration,
  login,
  logout,
  getCurrent,
  updateBalance,
  googleAuth,
  googleRedirect,
  // uploadAvatar,
  verifyUser,
  repeatEmailForVerifyUser,
} from '../../controllers/auth/index';
import { addAuthValidation } from './validationAuth';
import { guard } from '../../middlewares/guard';
// import { upload } from "../../../middlewares/upload";

const authRouter = new Router();

authRouter.post('/registration', addAuthValidation, registration);
authRouter.get('/google', googleAuth);
authRouter.get('/google-redirect', googleRedirect);
authRouter.post('/login', addAuthValidation, login);
authRouter.post('/logout', guard, logout);
authRouter.get('/current', guard, getCurrent);
authRouter.patch('/balance', guard, updateBalance);
// authRouter.patch("/avatar", guard, upload.single("avatar"), uploadAvatar);
authRouter.get('/verify/:verificationToken', verifyUser);
authRouter.post('/verify', repeatEmailForVerifyUser);

export default authRouter;
