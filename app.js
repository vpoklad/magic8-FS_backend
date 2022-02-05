import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { HttpCode, LIMIT_JSON } from './lib/constants';

// import transactionsRouter from './routes/api/transactions';
import authRouter from './routes/auth';

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: LIMIT_JSON }));

//Routes

app.use('/api/users', authRouter);
// app.use('/api/transactions', transactionsRouter);

app.use((req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found rout',
    });
});

app.use((err, req, res, next) => {
  res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
    status: 'fail',
    code: HttpCode.INTERNAL_SERVER_ERROR,
    message: err.message,
  });
});

export default app;
