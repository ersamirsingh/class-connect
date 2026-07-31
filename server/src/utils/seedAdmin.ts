import { UserModel } from '../modules/user/user.model';
import { logger } from './logger';

export const seedAdminUser = async (): Promise<void> => {
  try {
    const existingAdmin = await UserModel.findOne({ role: 'admin' });
    if (!existingAdmin) {
      const adminUser = new UserModel({
        name: 'System Admin',
        email: 'admin@classconnect.com',
        password: 'Admin@123456',
        role: 'admin',
        phone: '+1 800 555 0199',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
      });
      await adminUser.save();
      logger.info('Pre-seeded default admin user: admin@classconnect.com / Admin@123456');
    } else {
      logger.info(`Admin user existing: ${existingAdmin.email}`);
    }
  } catch (error: any) {
    logger.error(`Error seeding admin user: ${error.message}`);
  }
};
