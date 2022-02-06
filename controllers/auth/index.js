/* eslint-disable no-unused-vars */
import { HttpCode } from '../../lib/constants';
import authService from '../../services/auth/index';
import axios from 'axios';
import URL from 'url';
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
import { query } from 'express';

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
      code: HttpCode.CONFLICT,
      message: 'Invalid credentials',
    });
  }
  const token = authService.getToken(user);
  await authService.setToken(user.id, token);
  res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { token, email } });
};

const logout = async (req, res, _next) => {
  await authService.setToken(req.user.id, null);
  res
    .status(HttpCode.NO_CONTENT)
    .json({ status: 'success', code: HttpCode.OK, data: {} });
};

const getCurrent = (req, res, _next) => {
  const { email, role } = req.user;
  res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: { email, role },
  });
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

//Google auth func

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

const googleRedirect = async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search);

  const code = urlParams.code;

  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: 'post',
    data: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.BASE_URL}/auth/google-redirect`,
      grant_type: 'authorization_code',
      code,
    },
  });

  const userData = await axios({
    url: 'https://www.googleapis.com/oauth2/v2/userinfo',
    method: 'get',
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });

  return res.redirect(
    `${process.env.FRONTEND_URL}?email=${userData.data.email}`,
  );
};

export {
  registration,
  login,
  logout,
  getCurrent,
  // uploadAvatar,
  repeatEmailForVerifyUser,
  verifyUser,
  googleAuth,
  googleRedirect,
};
