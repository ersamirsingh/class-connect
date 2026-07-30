import mongoose from 'mongoose';
import { config } from './index';
import { logger } from '../utils/logger';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('MongoDB connected successfully');
  } catch (error: any) {
    logger.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};
