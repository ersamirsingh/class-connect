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

  static async verifyPublicCertificate(uniqueId: string) {
    const progress = await ProgressModel.findOne({ certificateId: uniqueId });
    if (!progress || !progress.certificateId) {
      throw new Error('Invalid or unverified certificate ID.');
    }

    const student = await UserModel.findById(progress.student);
    const course = await CourseModel.findById(progress.course);

    return {
      certificateId: progress.certificateId,
      issuedAt: progress.certificateIssuedAt || progress.updatedAt,
      studentName: student?.name || 'ClassConnect Scholar',
      courseTitle: course?.title || 'Course Masterclass',
      instructorName: course?.instructor?.name || 'ClassConnect Master',
      isValid: true,
    };
  }

  static async checkEnrollmentStatus(studentId: string, courseId: string) {
    const enrollment = await EnrollmentModel.findOne({ student: studentId, course: courseId, status: 'active' });
    return { isEnrolled: !!enrollment, orderId: enrollment?.order, enrollment };
  }

  static async getCourseTopicUnlockStatus(studentId: string, courseId: string) {
    const course = await CourseModel.findById(courseId);
    if (!course) throw new Error('Course not found.');

    const progress = await ProgressModel.findOne({ student: studentId, course: courseId });
    const completedSet = new Set(progress?.completedLectures ? progress.completedLectures.map(id => id.toString()) : []);

    const unlockedSections: number[] = [];
    const sectionStatus: { index: number; title: string; isUnlocked: boolean; isCompleted: boolean }[] = [];

    let allPrevCompleted = true;

    if (course.sections && course.sections.length > 0) {
      course.sections.forEach((sec, idx) => {
        const isUnlocked = course.type === 'live' || idx === 0 || allPrevCompleted;
        const lectures = sec.lectures || [];
        const isCompleted = lectures.length > 0 && lectures.every(l => completedSet.has(l._id ? l._id.toString() : ''));

        if (isUnlocked) unlockedSections.push(idx);
        sectionStatus.push({
          index: idx,
          title: sec.title,
          isUnlocked,
          isCompleted,
        });

        if (!isCompleted) {
          allPrevCompleted = false;
        }
      });
    }

    return {
      courseId: course._id,
      courseType: course.type,
      unlockedSections,
      sectionStatus,
      completedLectures: Array.from(completedSet),
    };
  }

  static async getLecturePlayback(studentId: string, courseId: string, lectureId: string) {
    const course = await CourseModel.findById(courseId);
    if (!course) throw new Error('Course not found.');

    let targetSectionIndex = -1;
    let targetLecture = null;

    if (course.sections) {
      for (let sIdx = 0; sIdx < course.sections.length; sIdx++) {
        const sec = course.sections[sIdx];
        const lec = sec.lectures.find(l => (l._id ? l._id.toString() === lectureId : false) || (l as any).id === lectureId);
        if (lec) {
          targetSectionIndex = sIdx;
          targetLecture = lec;
          break;
        }
      }
    }

    if (!targetLecture || targetSectionIndex === -1) {
      throw new Error('Lecture not found in this course.');
    }

    if (targetLecture.isPreview) {
      return { lecture: targetLecture, isUnlocked: true };
    }

    const { isEnrolled } = await EnrollmentService.checkEnrollmentStatus(studentId, courseId);
    if (!isEnrolled) {
      const err: any = new Error('Enrollment required to access lecture playback.');
      err.statusCode = 403;
      throw err;
    }

    if (course.type !== 'live' && targetSectionIndex > 0) {
      const unlockStatus = await EnrollmentService.getCourseTopicUnlockStatus(studentId, courseId);
      const isUnlocked = unlockStatus.unlockedSections.includes(targetSectionIndex);
      if (!isUnlocked) {
        const prevSectionTitle = course.sections[targetSectionIndex - 1]?.title || 'previous topic';
        const err: any = new Error(`Topic is locked. Complete all lectures in "${prevSectionTitle}" to unlock.`);
        err.statusCode = 403;
        throw err;
      }
    }

    return { lecture: targetLecture, isUnlocked: true };
  }
}
