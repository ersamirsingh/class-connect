import { UserModel, IUser } from '../../modules/user/user.model';

export interface SeededUsers {
  admin: IUser;
  student1: IUser;
  student2: IUser;
  student3: IUser;
  student4: IUser;
  student5: IUser;
}

export async function seedUsers(): Promise<SeededUsers> {
  console.log('👤 Seeding Users...');

  const rawPassword = 'Password@123';

  const usersData = [
    {
      email: 'admin@test.com',
      name: 'Samir Singh',
      role: 'admin' as const,
      phone: '+91 98765 00000',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
    {
      email: 'student1@test.com',
      name: 'Priti Singh',
      role: 'student' as const,
      phone: '+91 98765 11111',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    },
    {
      email: 'student2@test.com',
      name: 'Priya Verma',
      role: 'student' as const,
      phone: '+91 98765 22222',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    },
    {
      email: 'student3@test.com',
      name: 'Rohan Mehta',
      role: 'student' as const,
      phone: '+91 98765 33333',
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
    },
    {
      email: 'student4@test.com',
      name: 'Sneha Iyer',
      role: 'student' as const,
      phone: '+91 98765 44444',
      photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250',
    },
    {
      email: 'student5@test.com',
      name: 'Karan Singh',
      role: 'student' as const,
      phone: '+91 98765 55555',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    },
  ];

  const resultMap: Record<string, IUser> = {};

  for (const item of usersData) {
    let user = await UserModel.findOne({ email: item.email }).select('+password');
    if (!user) {
      user = await UserModel.create({
        ...item,
        password: rawPassword,
        isActive: true,
      });
      console.log(`  ✓ Created user: ${item.email} (${item.role})`);
    } else {
      // Re-save password to ensure it is correctly hashed once
      user.password = rawPassword;
      user.name = item.name;
      user.role = item.role;
      user.isActive = true;
      await user.save();
      console.log(`  ✓ Reset & updated user password: ${item.email}`);
    }
    resultMap[item.email] = user;
  }

  return {
    admin: resultMap['admin@test.com'],
    student1: resultMap['student1@test.com'],
    student2: resultMap['student2@test.com'],
    student3: resultMap['student3@test.com'],
    student4: resultMap['student4@test.com'],
    student5: resultMap['student5@test.com'],
  };
}
