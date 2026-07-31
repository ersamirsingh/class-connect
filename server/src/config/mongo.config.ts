import mongoose, { Connection } from 'mongoose';
import { config } from './index';
import { logger } from '../utils/logger';

let primaryDbConn: Connection | null = null;
let secondaryDbConn: Connection | null = null;

export const connectDB = async (): Promise<{ primary: Connection; secondary?: Connection }> => {
  // If primary database connection instance is already present/active, return immediately
  if (mongoose.connection.readyState === 1 && primaryDbConn) {
    logger.info('DB connection instances already active. Returning existing instances.');
    return { primary: primaryDbConn, secondary: secondaryDbConn || undefined };
  }

  try {
    // 1. Establish Primary DB Connection
    await mongoose.connect(config.mongoUri);
    primaryDbConn = mongoose.connection;
    logger.info('Primary MongoDB connected successfully');

    // 2. Establish Secondary DB Connection if configured
    const secondaryUri = process.env.SECONDARY_MONGO_URI || process.env.MONGO_URI_SECONDARY;
    if (secondaryUri) {
      secondaryDbConn = mongoose.createConnection(secondaryUri);
      secondaryDbConn.on('connected', () => logger.info('Secondary MongoDB connected successfully'));
      secondaryDbConn.on('error', (err) => logger.error(`Secondary MongoDB error: ${err.message}`));
    }

    return { primary: primaryDbConn, secondary: secondaryDbConn || undefined };
  } catch (error: any) {
    logger.error(`MongoDB connection error: ${error.message}`);
    throw error;
  }
};

export const getDbInstances = () => ({
  primary: primaryDbConn || mongoose.connection,
  secondary: secondaryDbConn,
});
