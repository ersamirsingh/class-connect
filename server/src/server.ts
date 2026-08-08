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
    // Concurrent startup: Connect MongoDB and Redis in parallel using Promise.all
    logger.info('Initializing MongoDB & Redis connections concurrently...');
    await Promise.all([
      connectDB().then(() => logger.info('MongoDB connected successfully')),
      connectRedis().then(() => logger.info('Redis connected successfully')),
    ]);

    const httpServer = http.createServer(app);
    initLiveSocket(httpServer);

    httpServer.listen(config.port, () => {
      logger.info(`Server & Socket.io listening on http://localhost:${config.port}`);
    });
  } catch (error: any) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
