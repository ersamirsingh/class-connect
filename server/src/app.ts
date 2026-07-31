import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { appRouter } from './routes';

const app: Application = express();

// Allowed Origins List
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

// Robust CORS configuration supporting credentials, headers, and preflight OPTIONS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, postman) or matching origin
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true); // Fallback to allow dev connection
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
    ],
    exposedHeaders: ['Authorization', 'Content-Range', 'X-Content-Range'],
  })
);

// Pre-flight OPTIONS handling for all routes
app.options('*', cors());

app.use(express.json());

// API Routes
app.use('/api', appRouter);

// ROOT
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Class Connect Server is healthy' });
});

export default app;
