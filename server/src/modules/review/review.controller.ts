import { Response } from 'express';
import { ReviewService } from './review.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class ReviewController {
  static async addReview(req: AuthRequest, res: Response): Promise<void> {
    try {
      const studentId = req.user!._id.toString();
      const { courseId, rating, comment } = req.body;

      if (!courseId || !rating || !comment) {
        res.status(400).json({ success: false, message: 'courseId, rating (1-5), and comment are required.' });
        return;
      }

      const review = await ReviewService.addReview({
        studentId,
        courseId,
        rating: Number(rating),
        comment,
      });

      res.status(201).json({ success: true, message: 'Review published.', data: review });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getCourseReviews(req: AuthRequest, res: Response): Promise<void> {
    try {
      const courseId = req.params.courseId as string;
      const reviews = await ReviewService.getCourseReviews(courseId);
      res.status(200).json({ success: true, data: reviews });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async deleteReview(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await ReviewService.deleteReview(id);
      res.status(200).json({ success: true, message: 'Review deleted.' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
