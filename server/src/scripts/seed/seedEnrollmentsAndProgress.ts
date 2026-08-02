import { EnrollmentModel } from '../../modules/enrollment/enrollment.model';
import { ProgressModel } from '../../modules/enrollment/progress.model';
import { SeededUsers } from './seedUsers';
import { SeededCourses } from './seedCourses';
import { SeededOrders } from './seedOrders';

export async function seedEnrollmentsAndProgress(
  users: SeededUsers,
  courses: SeededCourses,
  orders: SeededOrders
) {
  console.log('🎓 Seeding Enrollments & Progress...');

  const enrollmentData = [
    {
      student: users.student1._id,
      course: courses.appliedMathCourse._id,
      order: orders.student1AppliedMathOrder._id,
      status: 'active' as const,
    },
    {
      student: users.student1._id,
      course: courses.mernCourse._id,
      order: orders.student1MernOrder._id,
      status: 'active' as const,
    },
    {
      student: users.student2._id,
      course: courses.appliedMathCourse._id,
      order: orders.student2AppliedMathOrder._id,
      status: 'active' as const,
    },
  ];

  for (const item of enrollmentData) {
    let enrollment = await EnrollmentModel.findOne({
      student: item.student,
      course: item.course,
    });
    if (!enrollment) {
      await EnrollmentModel.create(item);
      console.log(`  ✓ Created enrollment: student ${item.student} in course ${item.course}`);
    } else {
      console.log(`  ℹ Enrollment already exists for student ${item.student} in course ${item.course}`);
    }
  }

  // --- SEED PROGRESS ---

  // 1. student1 + Applied Math -> 4 of 9 lectures complete, partial position
  const mathLectures = (courses.appliedMathCourse.sections || []).flatMap(s => s.lectures || []);
  const student1CompletedLectureIds = mathLectures.slice(0, 4).map(l => (l._id ? l._id.toString() : l.title));
  const fifthLectureId = mathLectures[4]?._id ? mathLectures[4]._id.toString() : mathLectures[4]?.title || 'lecture-5';

  let p1 = await ProgressModel.findOne({
    student: users.student1._id,
    course: courses.appliedMathCourse._id,
  });

  if (!p1) {
    await ProgressModel.create({
      student: users.student1._id,
      course: courses.appliedMathCourse._id,
      completedLectures: student1CompletedLectureIds,
      lastWatched: {
        lectureId: fifthLectureId,
        positionSeconds: 320,
      },
      isCompleted: false,
    });
    console.log(`  ✓ Created progress: student1 + Applied Math (4/9 lectures, 44% complete)`);
  }

  // 2. student2 + Applied Math -> 9 of 9 lectures complete (100% complete)
  const student2CompletedLectureIds = mathLectures.map(l => (l._id ? l._id.toString() : l.title));
  let p2 = await ProgressModel.findOne({
    student: users.student2._id,
    course: courses.appliedMathCourse._id,
  });

  if (!p2) {
    await ProgressModel.create({
      student: users.student2._id,
      course: courses.appliedMathCourse._id,
      completedLectures: student2CompletedLectureIds,
      lastWatched: {
        lectureId: student2CompletedLectureIds[student2CompletedLectureIds.length - 1] || 'lecture-9',
        positionSeconds: 1180,
      },
      isCompleted: true,
      certificateId: 'CERT-MATH-2026-001',
      certificateIssuedAt: new Date(),
    });
    console.log(`  ✓ Created progress: student2 + Applied Math (9/9 lectures, 100% complete + Certificate)`);
  }

  // 3. student1 + MERN -> 0 of 4 lectures complete (0% "just started" state)
  let p3 = await ProgressModel.findOne({
    student: users.student1._id,
    course: courses.mernCourse._id,
  });

  if (!p3) {
    await ProgressModel.create({
      student: users.student1._id,
      course: courses.mernCourse._id,
      completedLectures: [],
      lastWatched: {
        lectureId: '',
        positionSeconds: 0,
      },
      isCompleted: false,
    });
    console.log(`  ✓ Created progress: student1 + MERN (0/4 lectures, 0% complete)`);
  }
}
