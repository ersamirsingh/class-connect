import Redis from 'ioredis';
import { config } from './index';
import { logger } from '../utils/logger';

let redisInstance: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (!redisInstance) {
    redisInstance = new Redis({
      host: config.redisHost,
      port: config.redisPort,
      username: config.redisUsername,
      password: config.redisPassword,
      lazyConnect: true,
    });
  }
  return redisInstance;
};

export const connectRedis = async (): Promise<Redis> => {
  const client = getRedisClient();

  if (client.status === 'ready' || client.status === 'connecting' || client.status === 'connect') {
    return client;
  }

  try {
    await client.connect();
    logger.info('Redis connected successfully');
  } catch (error: any) {
    logger.error(`Redis connection error: ${error.message}`);
  }

  return client;
};

export const redisClient = getRedisClient();