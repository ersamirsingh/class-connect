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
  const courseCanva = await CourseModel.findOne({ slug: 'canva-mastery' });
  const courseSales = await CourseModel.findOne({ slug: 'sales-lead-generation-skills' });

  const order1 = await OrderModel.findOne({ receiptId: 'REC-GOOGLE-ADS-01' });
  const order2 = await OrderModel.findOne({ receiptId: 'REC-CHATGPT-01' });
  const order3 = await OrderModel.findOne({ receiptId: 'REC-GOOGLE-ADS-02' });
  const orderCanva1 = await OrderModel.findOne({ receiptId: 'REC-CANVA-S1' });
  const orderSales1 = await OrderModel.findOne({ receiptId: 'REC-SALES-S1' });

  if (!student1 || !student2 || !courseGoogleAds || !courseChatGPT || !courseCanva || !courseSales || !order1 || !order2 || !order3 || !orderCanva1 || !orderSales1) {
    throw new Error('Users, Courses, and Orders must be seeded before seeding enrollments.');
  }

  // Extract lecture titles from Google Ads & Canva
  const googleAdsLectures: string[] = [];
  courseGoogleAds.sections.forEach((sec) => {
    sec.lectures.forEach((lec) => {
      googleAdsLectures.push(lec.title);
    });
  });

  const canvaLectures: string[] = [];
  courseCanva.sections.forEach((sec) => {
    sec.lectures.forEach((lec) => {
      canvaLectures.push(lec.title);
    });
  });

  // 1. student1 + Google Ads (60% Progress: 5/9 lectures complete, currentTime on 6th)
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

  const sixtyPercentCompleted = googleAdsLectures.slice(0, 5); // 5 of 9 = ~60%
  let prog1 = await ProgressModel.findOne({ student: student1._id, course: courseGoogleAds._id });
  if (!prog1) {
    await ProgressModel.create({
      student: student1._id,
      course: courseGoogleAds._id,
      completedLectures: sixtyPercentCompleted,
      lastWatched: {
        lectureId: googleAdsLectures[5] || 'Audience Targeting',
        positionSeconds: 240,
      },
      isCompleted: false,
    });
    console.log('  └─ Created Progress: student1 + Google Ads (60% Complete - 5/9)');
  }

  // 2. student1 + Canva Mastery (100% Completed Course)
  let enrollCanva1 = await EnrollmentModel.findOne({ student: student1._id, course: courseCanva._id });
  if (!enrollCanva1) {
    enrollCanva1 = await EnrollmentModel.create({
      student: student1._id,
      course: courseCanva._id,
      order: orderCanva1._id,
      status: 'active',
      enrolledAt: orderCanva1.createdAt,
    });
    console.log('  └─ Created Enrollment: student1 + Canva Mastery');
  }

  let progCanva1 = await ProgressModel.findOne({ student: student1._id, course: courseCanva._id });
  if (!progCanva1) {
    await ProgressModel.create({
      student: student1._id,
      course: courseCanva._id,
      completedLectures: canvaLectures,
      lastWatched: {
        lectureId: canvaLectures[canvaLectures.length - 1] || 'Exporting Assets for Print & Web',
        positionSeconds: 600,
      },
      isCompleted: true,
      certificateId: 'CERT-CANVA-1001',
      certificateIssuedAt: new Date(),
    });
    console.log('  └─ Created Progress: student1 + Canva Mastery (100% Complete)');
  }

  // 3. student1 + ChatGPT & AI Tools (0% Progress - Just Enrolled)
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

  // 4. student1 + Sales and Lead Generation Skills (0% Progress - Enrolled)
  let enrollSales1 = await EnrollmentModel.findOne({ student: student1._id, course: courseSales._id });
  if (!enrollSales1) {
    enrollSales1 = await EnrollmentModel.create({
      student: student1._id,
      course: courseSales._id,
      order: orderSales1._id,
      status: 'active',
      enrolledAt: orderSales1.createdAt,
    });
    console.log('  └─ Created Enrollment: student1 + Sales Skills');
  }

  let progSales1 = await ProgressModel.findOne({ student: student1._id, course: courseSales._id });
  if (!progSales1) {
    await ProgressModel.create({
      student: student1._id,
      course: courseSales._id,
      completedLectures: [],
      isCompleted: false,
    });
    console.log('  └─ Created Progress: student1 + Sales Skills (0% Enrolled)');
  }

  // 5. student2 + Google Ads (100% Complete Progress: 9/9 lectures)
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

  console.log('✅ Enrollments & Progress Seeding Complete.\n');
}
