import { UserModel } from '../../modules/user/user.model';
import bcrypt from 'bcryptjs';

export async function seedUsers() {
  console.log('👤 Seeding Users...');

  // Hash shared password ONCE at top of script per prompt requirement
  const sharedPasswordHash = await bcrypt.hash('Password@123', 10);

  const adminData = {
    email: 'admin@test.com',
    password: 'Password@123',
    role: 'admin' as const,
    name: 'Samir',
    isActive: true,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  };

  const existingAdmin = await UserModel.findOne({ email: adminData.email });
  if (!existingAdmin) {
    await UserModel.create(adminData);
    console.log('  └─ Created Admin: Samir (admin@test.com)');
  } else {
    console.log('  └─ Admin already exists: Samir (admin@test.com)');
  }

  const studentUsers = [
    { email: 'student1@test.com', password: 'Password@123', name: 'Md Yusuf', role: 'student' as const, isActive: true, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' },
    { email: 'student2@test.com', password: 'Password@123', name: 'Priti Singh', role: 'student' as const, isActive: true, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250' },
    { email: 'student3@test.com', password: 'Password@123', name: 'Rohan Mehta', role: 'student' as const, isActive: true, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250' },
    { email: 'student4@test.com', password: 'Password@123', name: 'Sneha Iyer', role: 'student' as const, isActive: true, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250' },
    { email: 'student5@test.com', password: 'Password@123', name: 'Karan Singh', role: 'student' as const, isActive: true, photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250' },
  ];

  for (const student of studentUsers) {
    const existing = await UserModel.findOne({ email: student.email });
    if (!existing) {
      await UserModel.create(student);
      console.log(`  └─ Created Student: ${student.name} (${student.email})`);
    } else {
      console.log(`  └─ Student already exists: ${student.name}`);
    }
  }

  console.log('✅ Users Seeding Complete.\n');
}

