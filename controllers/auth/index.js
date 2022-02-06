/* eslint-disable no-unused-vars */
import { HttpCode } from '../../lib/constants';
import authService from '../../services/auth/index';
import axios from 'axios';
import queryString from 'query-string';

// import {
//   UploadFileService,
//   CloudFileStorage,
//   LocalFileStorage,
// } from "../../service/file-storage";
import {
  // SenderNodemailer,
  SenderSendGrid,
  EmailService,
} from '../../services/email/index';
import repositoryUsers from '../../repository/user';

const registration = async (req, res, next) => {
  try {
    const { email } = req.body;
    const isUserExist = await authService.isUserExist(email);
    if (isUserExist) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email is already exist',
      });
    }
    const userData = await authService.create(req.body);
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new SenderSendGrid(),
    );

    const isMessageSend = await emailService.sendVerifyEmail(
      email,
      userData.name,
      userData.verificationToken,
    );
    delete userData.verificationToken;

    res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: { ...userData, verificationEmailSend: isMessageSend },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, _next) => {
  const { email, password } = req.body;
  const user = await authService.getUser(email, password);
  if (!user) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      message: 'Invalid credentials',
    });
  }
  const token = authService.getToken(user);
  await authService.setToken(user.id, token);
  res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: { token, email, balance: user.balance },
  });
};

const googleAuth = async (req, res) => {
  const stringifiedParams = queryString.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${process.env.BASE_URL}/auth/google-redirect`,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  });
  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`,
  );
};

const logout = async (req, res, _next) => {
  await authService.setToken(req.user.id, null);
  res
    .status(HttpCode.NO_CONTENT)
    .json({ status: 'success', code: HttpCode.NO_CONTENT, data: {} });
};

const getCurrent = (req, res, _next) => {
  const { email, name } = req.user;
  res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: { email, name },
  });
};

const updateBalance = async (req, res, next) => {
  const { id: userId } = req.user;
  const { balance } = req.body;
  console.log(typeof balance);
  if (!balance) {
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: `Missing field 'balance'`,
    });
  }
  await authService.setBalance(userId, balance);

  // if (!result) {
  //   return res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
  //     status: 'error',
  //     code: HttpCode.INTERNAL_SERVER_ERROR,
  //     message: 'Not found balance',
  //   });
  // }
  const userBalance = await authService.getBalance(userId);
  return res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { userBalance } });
};

// const uploadAvatar = async (req, res, _next) => {
//   const uploadService = new UploadFileService(
//     LocalFileStorage,
//     req.file,
//     req.user
//   );
//   const avatarUrl = await uploadService.updateAvatar();
//   res
//     .status(HttpCode.OK)
//     .json({ status: "success", code: HttpCode.OK, data: { avatarUrl } });
// };

const verifyUser = async (req, res, _next) => {
  const verifyToken = req.params.verificationToken;
  const getUserFromToken = await repositoryUsers.findByVerifyToken(verifyToken);
  if (getUserFromToken) {
    await repositoryUsers.updateVerification(getUserFromToken.id, true);
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: { message: 'Success' },
    });
  }
  res.status(HttpCode.BAD_REQUEST).json({
    status: 'bad request',
    code: HttpCode.BAD_REQUEST,
    data: { message: 'Invalid token' },
  });
};

const repeatEmailForVerifyUser = async (req, res, _next) => {
  const { email } = req.body;
  const user = await repositoryUsers.findByEmail(email);
  if (user) {
    const { name, verificationToken } = user;
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new SenderSendGrid(),
    );

    const isMessageSend = await emailService.sendVerifyEmail(
      email,
      name,
      verificationToken,
    );
    if (isMessageSend) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: { message: 'Verification email sent' },
      });
    }
    return res.status(HttpCode.SE).json({
      status: 'error',
      code: HttpCode.SE,
      data: { message: 'Service Unavailable' },
    });
  }
  res.status(HttpCode.NOT_FOUND).json({
    status: 'error',
    code: HttpCode.NOT_FOUND,
    data: { message: 'User with this email not found ' },
  });
};

export {
  registration,
  login,
  logout,
  getCurrent,
  googleAuth,
  updateBalance,
  // uploadAvatar,
  repeatEmailForVerifyUser,
  verifyUser,
};
