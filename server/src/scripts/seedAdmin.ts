import mongoose from 'mongoose';
import { config } from '../config';
import { UserModel } from '../modules/user/user.model';

async function seedAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB Connected.');

    const existingAdmin = await UserModel.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log(`[Seed] An admin already exists: ${existingAdmin.email} (ID: ${existingAdmin._id})`);
      process.exit(0);
    }

    const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@classconnect.com';
    const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'Admin@123456';
    const adminName = process.env.ADMIN_SEED_NAME || 'Platform Admin';

    const admin = new UserModel({
      name: adminName,
      email: adminEmail.toLowerCase(),
      password: adminPassword,
      role: 'admin',
      isActive: true,
      phone: '+1234567890',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    });

    await admin.save();
    console.log(`[Seed Success] Created first Admin account!`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Name: ${adminName}`);
    process.exit(0);
  } catch (error: any) {
    console.error('[Seed Error] Failed to seed admin:', error);
    process.exit(1);
  }
}

seedAdmin();
