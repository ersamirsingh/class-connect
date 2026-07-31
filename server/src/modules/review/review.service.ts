import { ReviewModel, IReview } from './review.model';
import { CourseModel } from '../course/course.model';
import { EnrollmentModel } from '../enrollment/enrollment.model';

export class ReviewService {
  static async addReview(payload: {
    studentId: string;
    courseId: string;
    rating: number;
    comment: string;
  }): Promise<IReview> {
    const isEnrolled = await EnrollmentModel.findOne({
      student: payload.studentId,
      course: payload.courseId,
      status: 'active',
    });

    if (!isEnrolled) {
      throw new Error('Only enrolled students can post course reviews.');
    }

    const review = await ReviewModel.findOneAndUpdate(
      { course: payload.courseId, student: payload.studentId },
      { rating: payload.rating, comment: payload.comment },
      { upsert: true, new: true, runValidators: true }
    );

    // Recalculate average course rating
    const allReviews = await ReviewModel.find({ course: payload.courseId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1);

    await CourseModel.findByIdAndUpdate(payload.courseId, {
      rating: Number(avgRating.toFixed(1)),
      reviewsCount: allReviews.length,
    });

    return review;
  }

  static async getCourseReviews(courseId: string): Promise<IReview[]> {
    return ReviewModel.find({ course: courseId })
      .populate('student', 'name photo')
      .sort({ createdAt: -1 });
  }

  static async deleteReview(reviewId: string) {
    const review = await ReviewModel.findByIdAndDelete(reviewId);
    if (review) {
      const allReviews = await ReviewModel.find({ course: review.course });
      const avgRating =
        allReviews.length > 0
          ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
          : 5.0;

      await CourseModel.findByIdAndUpdate(review.course, {
        rating: Number(avgRating.toFixed(1)),
        reviewsCount: allReviews.length,
      });
    }
    return review;
  }
}
