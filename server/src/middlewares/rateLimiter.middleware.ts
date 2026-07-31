import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../config/redis.config';
import { logger } from '../utils/logger';

const createAuthRateLimiter = () => {
  try {
    const isRedisReady = redisClient.status === 'ready' || redisClient.status === 'connecting';

    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 20, // limit each IP to 20 auth requests per windowMs
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: 'Too many authentication attempts. Please try again after 15 minutes.',
      },
      store: isRedisReady
        ? new RedisStore({
            // @ts-ignore
            sendCommand: (...args: string[]) => redisClient.call(...args),
            prefix: 'auth_rl:',
          })
        : undefined, // fallback to MemoryStore if Redis isn't connected
    });
  } catch (err: any) {
    logger.warn(`Redis rate limiter init fallback to memory: ${err.message}`);
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 20,
      message: {
        success: false,
        message: 'Too many authentication attempts. Please try again after 15 minutes.',
      },
    });
  }
};

export const authRateLimiter = createAuthRateLimiter();
