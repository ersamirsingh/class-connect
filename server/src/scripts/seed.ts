import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { connectDB } from '../config/mongo.config';
import mongoose from 'mongoose';

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
  console.log('🚀 Starting ClassConnect Full-Stack Data Seeding...\n');

  // SAFETY GUARD: Refuse to run in production environment
  if (process.env.NODE_ENV === 'production') {
    console.error('❌ CRITICAL SAFETY ERROR: Seeding is strictly forbidden in production environment (NODE_ENV=production).');
    process.exit(1);
  }

  try {
    // 0. Connect to DB
    await connectDB();
    console.log('\n--- Beginning Module Seeding Sequence ---\n');

    // 1. Seed Users (admin + 5 students)
    const users = await seedUsers();

    // 2. Seed Categories (5 categories)
    const categories = await seedCategories();

    // 3. Seed Courses (Category → Course → Topic → Lecture)
    const courses = await seedCourses(categories);

    // 4. Seed Orders (success, pending, failed, student5 has 0)
    const orders = await seedOrders(users, courses);

    // 5. Seed Enrollments & Progress (partial, 100%, 0%)
    await seedEnrollmentsAndProgress(users, courses, orders);

    // 6. Seed Reviews
    await seedReviews(users, courses);

    // 7. Seed Reports
    await seedReports(users, courses);

    // 8. Seed Content Blocks (CMS hero, testimonials, about, footer)
    await seedContentBlocks();

    // 9. Seed Notifications
    await seedNotifications(users);

    console.log('\n✅ ALL MODULE SEEDS COMPLETED SUCCESSFULLY!');
    console.log('\n--- Default Seeded Accounts ---');
    console.log('🔑 Admin:    admin@test.com / Password@123');
    console.log('🔑 Student1: student1@test.com / Password@123 (Applied Math [44%] + MERN [0%])');
    console.log('🔑 Student2: student2@test.com / Password@123 (Applied Math [100% + Certificate])');
    console.log('🔑 Student3: student3@test.com / Password@123 (Data Science [Pending Order])');
    console.log('🔑 Student4: student4@test.com / Password@123 (UI/UX [Failed Order])');
    console.log('🔑 Student5: student5@test.com / Password@123 (0 Orders - Empty State Test)');
    console.log('--------------------------------');

  } catch (error) {
    console.error('❌ Error during data seeding:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Database connection closed.');
    process.exit(0);
  }
}

runMasterSeed();
