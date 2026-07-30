import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { appRouter } from './routes';

const app: Application = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', appRouter);

// ROOT
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Class Connect Server is healthy' });
});

export default app;
