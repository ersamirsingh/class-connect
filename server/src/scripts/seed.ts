import mongoose from 'mongoose';
import { config } from '../config';

import { seedUsers } from './seed/seedUsers';
import { seedCategories } from './seed/seedCategories';
import { seedCourses } from './seed/seedCourses';
import { seedOrders } from './seed/seedOrders';
import { seedEnrollmentsAndProgress } from './seed/seedEnrollmentsAndProgress';
import { seedReviews } from './seed/seedReviews';
import { seedReports } from './seed/seedReports';
import { seedContentBlocks } from './seed/seedContentBlocks';
import { seedNotifications } from './seed/seedNotifications';

async function runMasterSeed() {
  console.log('---------------------------------------------------------');
  console.log('🌱 ClassConnect Full-Stack Data Seeding Master Runner');
  console.log('---------------------------------------------------------\n');

  // SAFETY GUARD: Refuse to run in production
  if (process.env.NODE_ENV === 'production' || config.nodeEnv === 'production') {
    console.error('❌ SAFETY BLOCK: Refusing to run seed script in production environment!');
    process.exit(1);
  }

  try {
    console.log(`🔌 Connecting to Database at: ${config.mongoUri}...`);
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB successfully.\n');

    // Execution sequence (respecting foreign key dependencies)
    await seedUsers();
    await seedCategories();
    await seedCourses();
    await seedOrders();
    await seedEnrollmentsAndProgress();
    await seedReviews();
    await seedReports();
    await seedContentBlocks();
    await seedNotifications();

    console.log('---------------------------------------------------------');
    console.log('🎉 ALL DATA SEEDED SUCCESSFULLY WITH 100% IDEMPOTENCY!');
    console.log('---------------------------------------------------------\n');
  } catch (error: any) {
    console.error('❌ Error during data seeding:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    process.exit(0);
  }
}

runMasterSeed();
