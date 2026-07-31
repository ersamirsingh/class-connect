import { EnrollmentModel } from './enrollment.model';
import { ProgressModel } from './progress.model';
import { CourseModel } from '../course/course.model';
import { UserModel } from '../user/user.model';

export class EnrollmentService {
  static async getStudentEnrollments(studentId: string) {
    const enrollments = await EnrollmentModel.find({ student: studentId, status: 'active' })
      .populate({
        path: 'course',
        populate: { path: 'category' },
      })
      .sort({ enrolledAt: -1 });

    const results = await Promise.all(
      enrollments.map(async (e) => {
        const course: any = e.course;
        if (!course) return null;

        // Fetch progress
        let progress = await ProgressModel.findOne({ student: studentId, course: course._id });
        if (!progress) {
          progress = new ProgressModel({ student: studentId, course: course._id, completedLectures: [] });
          await progress.save();
        }

        // Calculate total lectures
        let totalLectures = 0;
        if (course.sections && course.sections.length > 0) {
          course.sections.forEach((sec: any) => {
            if (sec.lectures) totalLectures += sec.lectures.length;
          });
        }
        if (totalLectures === 0) totalLectures = 1; // avoid divide by zero

        const completedCount = progress.completedLectures ? progress.completedLectures.length : 0;
        const progressPercent = Math.min(100, Math.round((completedCount / totalLectures) * 100));

        // Determine if live class is currently active
        const now = new Date();
        const isLiveNow =
          course.type === 'live' &&
          course.liveSchedule?.startTime &&
          new Date(course.liveSchedule.startTime) <= now &&
          course.liveSchedule?.endTime &&
          new Date(course.liveSchedule.endTime) >= now;

        return {
          enrollmentId: e._id,
          enrolledAt: e.enrolledAt,
          course,
          progressPercent,
          completedCount,
          totalLectures,
          isCompleted: progress.isCompleted || progressPercent === 100,
          certificateId: progress.certificateId,
          isLiveNow,
        };
      })
    );

    return results.filter(Boolean);
  }

  static async markLectureComplete(studentId: string, courseId: string, lectureId: string) {
    let progress = await ProgressModel.findOne({ student: studentId, course: courseId });
    if (!progress) {
      progress = new ProgressModel({ student: studentId, course: courseId, completedLectures: [] });
    }

    if (!progress.completedLectures.includes(lectureId)) {
      progress.completedLectures.push(lectureId);
    }

    // Check if course is 100% completed
    const course = await CourseModel.findById(courseId);
    let totalLectures = 0;
    if (course && course.sections) {
      course.sections.forEach((s) => (totalLectures += s.lectures.length));
    }
    if (totalLectures > 0 && progress.completedLectures.length >= totalLectures) {
      progress.isCompleted = true;
      if (!progress.certificateId) {
        progress.certificateId = `CERT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        progress.certificateIssuedAt = new Date();
      }
    }

    await progress.save();
    return progress;
  }

  static async getCertificate(studentId: string, courseId: string) {
    const progress = await ProgressModel.findOne({ student: studentId, course: courseId, isCompleted: true });
    if (!progress || !progress.certificateId) {
      throw new Error('Certificate not available. Please complete all course lectures first.');
    }

    const student = await UserModel.findById(studentId);
    const course = await CourseModel.findById(courseId);

    return {
      certificateId: progress.certificateId,
      issuedAt: progress.certificateIssuedAt || progress.updatedAt,
      studentName: student?.name || 'Student',
      courseTitle: course?.title || 'Course Masterclass',
      instructorName: course?.instructor?.name || 'ClassConnect Master',
    };
  }
}
