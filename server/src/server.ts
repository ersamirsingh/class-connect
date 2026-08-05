import 'dotenv/config';
import http from 'http';

import app from './app';
import { config } from './config';
import { connectDB } from './config/mongo.config';
import { connectRedis } from './config/redis.config';
import { logger } from './utils/logger';
import { initLiveSocket } from './socket/liveSocket';

const startServer = async () => {
  try {
    const httpServer = http.createServer(app);
    initLiveSocket(httpServer);

    const port = Number(process.env.PORT) || config.port || 5000;

    httpServer.listen(port, '0.0.0.0', () => {
      logger.info(`Server & Socket.io listening on http://0.0.0.0:${port}`);
    });

    // Connect to MongoDB and Redis asynchronously without delaying port binding
    connectDB()
      .then(() => logger.info('MongoDB connected successfully'))
      .catch((err) => logger.error(`MongoDB connection error: ${err.message}`));

    connectRedis()
      .then(() => logger.info('Redis connected successfully'))
      .catch((err) => logger.error(`Redis connection error: ${err.message}`));

  } catch (error: any) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
