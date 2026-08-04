import { ReportModel } from '../../modules/report/report.model';
import { UserModel } from '../../modules/user/user.model';
import { CourseModel } from '../../modules/course/course.model';

export async function seedReports() {
  console.log('🚨 Seeding Problem Reports...');

  const student1 = await UserModel.findOne({ email: 'student1@test.com' });
  const student2 = await UserModel.findOne({ email: 'student2@test.com' });
  const student3 = await UserModel.findOne({ email: 'student3@test.com' });
  const student4 = await UserModel.findOne({ email: 'student4@test.com' });

  const courseGoogleAds = await CourseModel.findOne({ slug: 'google-ads' });
  const courseCanva = await CourseModel.findOne({ slug: 'canva-mastery' });
  const courseSales = await CourseModel.findOne({ slug: 'sales-lead-generation-skills' });

  if (!student1 || !student2 || !student3 || !student4) {
    throw new Error('Users must be seeded before seeding reports.');
  }

  const reports = [
    {
      student: student3._id,
      category: 'payment' as const,
      status: 'open' as const,
      description: 'Payment was deducted from my bank via UPI but my order status still shows pending.',
      relatedCourse: courseCanva?._id,
      images: ['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600'],
    },
    {
      student: student4._id,
      category: 'payment' as const,
      status: 'in-progress' as const,
      description: 'Razorpay failed during checkout transaction for Sales and Lead Generation Skills course.',
      relatedCourse: courseSales?._id,
      adminNote: 'Investigating payment gateway transaction logs with Razorpay support desk.',
    },
    {
      student: student1._id,
      category: 'video' as const,
      status: 'resolved' as const,
      description: 'Video lecture 2 on Keyword Research had a buffering pause at 03:45. Resolved after cache clear.',
      relatedCourse: courseGoogleAds?._id,
      adminNote: 'Verified video asset delivery on Cloudinary server. User confirmed resolved.',
    },
    {
      student: student2._id,
      category: 'other' as const,
      status: 'open' as const,
      description: 'Feature request: Can we get dark mode support for PDF lecture downloads?',
    },
  ];

  for (const r of reports) {
    const existing = await ReportModel.findOne({ student: r.student, description: r.description });
    if (!existing) {
      await ReportModel.create(r);
      console.log(`  └─ Created Report: ${r.category} (${r.status})`);
    } else {
      console.log(`  └─ Report already exists: ${r.category}`);
    }
  }

  console.log('✅ Reports Seeding Complete.\n');
}
