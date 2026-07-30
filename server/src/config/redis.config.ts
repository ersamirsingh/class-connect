import Redis from 'ioredis';
import { config } from './index';
import { logger } from '../utils/logger';

export const redisClient = new Redis({
  host: config.redisHost,
  port: config.redisPort,
  username: config.redisUsername,
  password: config.redisPassword,
  lazyConnect: true,
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    logger.info('Redis connected successfully');
  } catch (error: any) {
    logger.error(`Redis connection error: ${error.message}`);
  }
};
