import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import logger from '../config/logger';
import morgan from 'morgan';
import authRoute from '../app/auth/routes';
import bookRoute from '../app/book/routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan('combined', {
    stream: { write: (message) => logger.info(message) },
  })
);

app.use('/healthcheck', (req: Request, res: Response) => {
  res.status(200).send('ScaleX API is healthy');
});

app.use('/auth', authRoute);
app.use('/book', bookRoute);

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Welcome to ScaleX API');
});

app.use((req: Request, res: Response) => {
  res.status(404).send('Resource not found');
});

export default app;
