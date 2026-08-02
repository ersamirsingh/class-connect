import mongoose, { Connection } from 'mongoose';
import { config } from './index';
import { logger } from '../utils/logger';

let mongoInstance: Connection | null = null;

export const connectDB = async (): Promise<Connection> => {
  if (mongoInstance && (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2)) {
    return mongoInstance;
  }

  try {
    await mongoose.connect(config.mongoUri);
    mongoInstance = mongoose.connection;
    logger.info('Primary MongoDB connected successfully');
    return mongoInstance;
  } catch (error: any) {
    logger.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};
