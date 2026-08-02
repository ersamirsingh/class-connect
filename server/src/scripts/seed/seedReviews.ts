import { ReviewModel } from '../../modules/review/review.model';
import { SeededUsers } from './seedUsers';
import { SeededCourses } from './seedCourses';

export async function seedReviews(users: SeededUsers, courses: SeededCourses) {
  console.log('⭐ Seeding Reviews...');

  const reviewsData = [
    {
      course: courses.appliedMathCourse._id,
      student: users.student1._id,
      rating: 5,
      comment: 'Exceptional masterclass! The calculus topics made limits and derivatives crystal clear. Highly recommend!',
    },
    {
      course: courses.appliedMathCourse._id,
      student: users.student2._id,
      rating: 4,
      comment: 'Great course structure and practice exercises. The live statistics session was super interactive.',
    },
  ];

  for (const item of reviewsData) {
    let review = await ReviewModel.findOne({
      course: item.course,
      student: item.student,
    });

    if (!review) {
      await ReviewModel.create(item);
      console.log(`  ✓ Created review for course: ${item.course} by student: ${item.student}`);
    } else {
      console.log(`  ℹ Review already exists for course: ${item.course} by student: ${item.student}`);
    }
  }
}
