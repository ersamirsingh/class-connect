import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/class-connect',
  redisHost: process.env.REDIS_HOST || '127.0.0.1',
  redisPort: Number(process.env.REDIS_PORT) || 6379,
  redisUsername: process.env.REDIS_USERNAME || 'default',
  redisPassword: process.env.REDIS_PASSWORD || '',
  nodeEnv: process.env.NODE_ENV || 'development',
};
