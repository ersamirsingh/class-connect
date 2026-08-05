import { ReviewModel } from '../../modules/review/review.model';
import { UserModel } from '../../modules/user/user.model';
import { CourseModel } from '../../modules/course/course.model';

export async function seedReviews() {
  console.log('⭐ Seeding Reviews...');

  const student1 = await UserModel.findOne({ email: 'student1@test.com' });
  const student2 = await UserModel.findOne({ email: 'student2@test.com' });
  const courseGoogleAds = await CourseModel.findOne({ slug: 'google-ads' });

  if (!student1 || !student2 || !courseGoogleAds) {
    throw new Error('Users and Courses must be seeded before seeding reviews.');
  }

  const reviews = [
    {
      course: courseGoogleAds._id,
      student: student1._id,
      rating: 5,
      comment: 'Outstanding course! The campaign setup and keyword match type lessons helped me double ROI in 2 weeks.',
    },
    {
      course: courseGoogleAds._id,
      student: student2._id,
      rating: 4,
      comment: 'Very comprehensive Google Ads breakdown. The bid strategy section was worth every rupee.',
    },
  ];

  for (const rev of reviews) {
    const existing = await ReviewModel.findOne({ course: rev.course, student: rev.student });
    if (!existing) {
      await ReviewModel.create(rev);
      console.log(`  └─ Created Review for Google Ads (${rev.rating} stars)`);
    } else {
      console.log('  └─ Review already exists for this student & course');
    }
  }

  console.log('✅ Reviews Seeding Complete.\n');
}
