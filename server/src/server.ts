import 'dotenv/config';

import app from './app';
import { config } from './config';
import { connectDB } from './config/mongo.config';
import { connectRedis } from './config/redis.config';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    await Promise.all([connectDB(), connectRedis()]);

    app.listen(config.port, () => {
      logger.info(`Server listening on http://localhost:${config.port}`);
    });
  } catch (error: any) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
