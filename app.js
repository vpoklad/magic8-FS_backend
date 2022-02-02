import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import { HttpCode, LIMIT_JSON } from './lib/constants';

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
app.use(helmet());
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json({ limit: LIMIT_JSON }));

//Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use((req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
    status: 'fail',
    code: HttpCode.INTERNAL_SERVER_ERROR,
    message: err.message,
  });
});

export default app;
