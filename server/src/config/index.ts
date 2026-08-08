import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/class-connect',
  redisHost: process.env.REDIS_HOST || '127.0.0.1',
  redisPort: Number(process.env.REDIS_PORT) || 6379,
  redisUsername: process.env.REDIS_USERNAME || 'default',
  redisPassword: process.env.REDIS_PASSWORD || '',
  jwtSecret: process.env.JWT_SECRET || 'classconnect_super_secret_jwt_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
  bunnyStreamApiKey: process.env.BUNNY_STREAM_API_KEY || '',
  bunnyStreamLibraryId: process.env.BUNNY_STREAM_LIBRARY_ID || '',
  bunnyStreamCdnUrl: process.env.BUNNY_STREAM_CDN_URL || 'https://iframe.mediadelivery.net',
  bunnyStorageApiKey: process.env.BUNNY_STORAGE_API_KEY || '',
  bunnyStorageZone: process.env.BUNNY_STORAGE_ZONE || '',
  bunnyStorageCdnUrl: process.env.BUNNY_STORAGE_CDN_URL || '',
};

