import { ReportModel } from '../../modules/report/report.model';
import { SeededUsers } from './seedUsers';
import { SeededCourses } from './seedCourses';

export async function seedReports(users: SeededUsers, courses: SeededCourses) {
  console.log('🚩 Seeding Problem Reports...');

  const reportsData = [
    {
      student: users.student3._id,
      category: 'payment' as const,
      description: 'My payment for Intro to Data Science is stuck in pending status after UPI transaction.',
      images: [],
      status: 'open' as const,
      relatedCourse: courses.dataScienceCourse._id,
      adminNote: '',
    },
    {
      student: users.student4._id,
      category: 'payment' as const,
      description: 'Card was charged for UI/UX Foundations but order status displays failed.',
      images: ['https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600'],
      status: 'in-progress' as const,
      relatedCourse: courses.uiUxCourse._id,
      adminNote: 'Checking Razorpay webhook logs for transaction confirmation.',
    },
    {
      student: users.student1._id,
      category: 'video' as const,
      description: 'Video stream would not load on Topic 2 Calculus Derivatives lecture on mobile Safari.',
      images: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'],
      status: 'resolved' as const,
      relatedCourse: courses.appliedMathCourse._id,
      adminNote: 'Verified Cloudinary HLS delivery stream; resolved buffering issue.',
    },
    {
      student: users.student2._id,
      category: 'other' as const,
      description: 'General feedback: Requesting additional practice problem sets for Statistics module.',
      images: [],
      status: 'open' as const,
      relatedCourse: courses.appliedMathCourse._id,
      adminNote: '',
    },
  ];

  for (const item of reportsData) {
    let report = await ReportModel.findOne({
      student: item.student,
      description: item.description,
    });

    if (!report) {
      await ReportModel.create(item);
      console.log(`  ✓ Created report for student: ${item.student} (${item.category} / ${item.status})`);
    } else {
      console.log(`  ℹ Report already exists for student: ${item.student}`);
    }
  }
}
