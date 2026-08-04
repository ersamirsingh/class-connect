import { EnrollmentModel } from '../../modules/enrollment/enrollment.model';
import { ProgressModel } from '../../modules/enrollment/progress.model';
import { OrderModel } from '../../modules/payment/payment.model';
import { UserModel } from '../../modules/user/user.model';
import { CourseModel } from '../../modules/course/course.model';

export async function seedEnrollmentsAndProgress() {
  console.log('🎓 Seeding Enrollments & Progress...');

  const student1 = await UserModel.findOne({ email: 'student1@test.com' });
  const student2 = await UserModel.findOne({ email: 'student2@test.com' });
  const courseGoogleAds = await CourseModel.findOne({ slug: 'google-ads' });
  const courseChatGPT = await CourseModel.findOne({ slug: 'chatgpt-ai-tools' });

  const order1 = await OrderModel.findOne({ receiptId: 'REC-GOOGLE-ADS-01' });
  const order2 = await OrderModel.findOne({ receiptId: 'REC-CHATGPT-01' });
  const order3 = await OrderModel.findOne({ receiptId: 'REC-GOOGLE-ADS-02' });

  if (!student1 || !student2 || !courseGoogleAds || !courseChatGPT || !order1 || !order2 || !order3) {
    throw new Error('Users, Courses, and Orders must be seeded before seeding enrollments.');
  }

  // 1. Enrollment student1 + Google Ads (Partial Progress: 4/9 lectures)
  let enroll1 = await EnrollmentModel.findOne({ student: student1._id, course: courseGoogleAds._id });
  if (!enroll1) {
    enroll1 = await EnrollmentModel.create({
      student: student1._id,
      course: courseGoogleAds._id,
      order: order1._id,
      status: 'active',
      enrolledAt: order1.createdAt,
    });
    console.log('  └─ Created Enrollment: student1 + Google Ads');
  }

  // Extract lecture titles/IDs from Google Ads
  const googleAdsLectures: string[] = [];
  courseGoogleAds.sections.forEach((sec) => {
    sec.lectures.forEach((lec) => {
      googleAdsLectures.push(lec.title);
    });
  });

  const partialCompleted = googleAdsLectures.slice(0, 4); // First 4 lectures
  let prog1 = await ProgressModel.findOne({ student: student1._id, course: courseGoogleAds._id });
  if (!prog1) {
    await ProgressModel.create({
      student: student1._id,
      course: courseGoogleAds._id,
      completedLectures: partialCompleted,
      lastWatched: {
        lectureId: googleAdsLectures[4] || 'Match Types Explained',
        positionSeconds: 180,
      },
      isCompleted: false,
    });
    console.log('  └─ Created Progress: student1 + Google Ads (Partial 4/9)');
  }

  // 2. Enrollment student2 + Google Ads (100% Complete Progress: 9/9 lectures)
  let enroll2 = await EnrollmentModel.findOne({ student: student2._id, course: courseGoogleAds._id });
  if (!enroll2) {
    enroll2 = await EnrollmentModel.create({
      student: student2._id,
      course: courseGoogleAds._id,
      order: order3._id,
      status: 'active',
      enrolledAt: order3.createdAt,
    });
    console.log('  └─ Created Enrollment: student2 + Google Ads');
  }

  let prog2 = await ProgressModel.findOne({ student: student2._id, course: courseGoogleAds._id });
  if (!prog2) {
    await ProgressModel.create({
      student: student2._id,
      course: courseGoogleAds._id,
      completedLectures: googleAdsLectures, // All 9 lectures
      lastWatched: {
        lectureId: googleAdsLectures[googleAdsLectures.length - 1] || 'Reading Performance Reports',
        positionSeconds: 1320,
      },
      isCompleted: true,
      certificateId: 'CERT-GA-1002',
      certificateIssuedAt: new Date(),
    });
    console.log('  └─ Created Progress: student2 + Google Ads (100% Complete)');
  }

  // 3. Enrollment student1 + ChatGPT & AI Tools (0% Progress)
  let enroll3 = await EnrollmentModel.findOne({ student: student1._id, course: courseChatGPT._id });
  if (!enroll3) {
    enroll3 = await EnrollmentModel.create({
      student: student1._id,
      course: courseChatGPT._id,
      order: order2._id,
      status: 'active',
      enrolledAt: order2.createdAt,
    });
    console.log('  └─ Created Enrollment: student1 + ChatGPT & AI Tools');
  }

  let prog3 = await ProgressModel.findOne({ student: student1._id, course: courseChatGPT._id });
  if (!prog3) {
    await ProgressModel.create({
      student: student1._id,
      course: courseChatGPT._id,
      completedLectures: [],
      isCompleted: false,
    });
    console.log('  └─ Created Progress: student1 + ChatGPT & AI Tools (0% Just Started)');
  }

  console.log('✅ Enrollments & Progress Seeding Complete.\n');
}
