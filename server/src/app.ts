import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { appRouter } from './routes';
import { mongoSanitizeMiddleware } from './middlewares/mongoSanitize.middleware';

const app: Application = express();

const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === clientUrl) {
        callback(null, true);
      } else {
        callback(new Error(`CORS Blocked: Origin ${origin} is not allowed by CORS configuration.`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  })
);

// Body Parsers with 50mb limit to support document image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(mongoSanitizeMiddleware);

// API Routes
app.use('/api', appRouter);

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'ClassConnect Server is running cleanly' });
});

export default app;
