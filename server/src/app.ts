import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { appRouter } from './routes';

const app: Application = express();

// Dynamically fetch client URL from environment variable (.env)
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS configuration reading target client origin from process.env
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests or requests matching configured clientUrl / dev origin
      if (!origin || origin === clientUrl || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  })
);

app.options('*', cors());

// Standard Body Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', appRouter);

// Health Check Endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'ClassConnect Server is running cleanly' });
});

export default app;
