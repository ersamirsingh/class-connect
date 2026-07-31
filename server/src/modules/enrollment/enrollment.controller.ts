import { Response } from 'express';
import { EnrollmentService } from './enrollment.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class EnrollmentController {
  static async getMyEnrollments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const studentId = req.user!._id.toString();
      const data = await EnrollmentService.getStudentEnrollments(studentId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async markComplete(req: AuthRequest, res: Response): Promise<void> {
    try {
      const studentId = req.user!._id.toString();
      const { courseId, lectureId } = req.body;
      if (!courseId || !lectureId) {
        res.status(400).json({ success: false, message: 'courseId and lectureId are required.' });
        return;
      }

      const progress = await EnrollmentService.markLectureComplete(studentId, courseId, lectureId);
      res.status(200).json({ success: true, message: 'Lecture marked as complete.', data: progress });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getCertificate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const studentId = req.user!._id.toString();
      const courseId = req.params.courseId as string;
      const cert = await EnrollmentService.getCertificate(studentId, courseId);
      res.status(200).json({ success: true, data: cert });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
