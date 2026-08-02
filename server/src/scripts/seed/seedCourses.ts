import { CourseModel, ICourse } from '../../modules/course/course.model';
import { SeededCategories } from './seedCategories';

export interface SeededCourses {
  appliedMathCourse: ICourse;
  mernCourse: ICourse;
  dataScienceCourse: ICourse;
  uiUxCourse: ICourse;
  digitalMarketingCourse: ICourse;
}

const SAMPLE_VIDEOS = [
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://www.w3schools.com/html/mov_bbb.mp4',
];

export async function seedCourses(categories: SeededCategories): Promise<SeededCourses> {
  console.log('📚 Seeding Courses (Category → Course → Topic → Lecture)...');

  const now = new Date();
  const pastDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
  const futureDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days in future

  // 1. SHOWCASE COURSE: "Applied Mathematics"
  const appliedMathCourseData = {
    title: 'Applied Mathematics Masterclass',
    slug: 'applied-mathematics-masterclass',
    subtitle: 'From Algebra to Calculus & Probability',
    description: 'Comprehensive mathematics course designed for university students and competitive exams. Covers linear equations, quadratic formulas, differential calculus, and probability distributions.',
    category: categories.appliedMath._id,
    type: 'hybrid' as const,
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200',
    previewVideo: SAMPLE_VIDEOS[0],
    maxPreviewViews: 3,
    price: 999,
    discountPrice: 799,
    rating: 4.9,
    ratingCount: 148,
    instructor: {
      name: 'Prof. Samir Singh',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      title: 'Senior Math Faculty',
    },
    sections: [
      {
        title: 'Algebra Basics',
        order: 1,
        lectures: [
          { title: 'Linear Equations & Systems', duration: '12:30', videoUrl: SAMPLE_VIDEOS[0], isPreview: true },
          { title: 'Quadratic Equations & Roots', duration: '15:45', videoUrl: SAMPLE_VIDEOS[1], isPreview: false },
          { title: 'Polynomial Functions', duration: '18:20', videoUrl: SAMPLE_VIDEOS[2], isPreview: false },
        ],
      },
      {
        title: 'Calculus Fundamentals',
        order: 2,
        lectures: [
          { title: 'Limits & Continuity', duration: '14:10', videoUrl: SAMPLE_VIDEOS[3], isPreview: false },
          { title: 'Derivatives & Chain Rule', duration: '20:15', videoUrl: SAMPLE_VIDEOS[4], isPreview: false },
          { title: 'Integrals & Area Under Curve', duration: '22:50', videoUrl: SAMPLE_VIDEOS[0], isPreview: false },
        ],
      },
      {
        title: 'Statistics & Probability',
        order: 3,
        lectures: [
          { title: 'Mean, Median & Variance', duration: '11:00', videoUrl: SAMPLE_VIDEOS[1], isPreview: false },
          { title: 'Probability Rules & Bayes Theorem', duration: '16:30', videoUrl: SAMPLE_VIDEOS[2], isPreview: false },
          { title: 'Normal & Binomial Distributions', duration: '19:45', videoUrl: SAMPLE_VIDEOS[3], isPreview: false },
        ],
      },
    ],
    liveSchedule: {
      startTime: pastDate,
      endTime: new Date(pastDate.getTime() + 90 * 60 * 1000),
      meetingUrl: 'https://meet.google.com/abc-defg-hij',
      status: 'ended' as const,
    },
    isPublished: true,
    isFeatured: true,
    isSuggested: true,
  };

  // 2. COURSE: "MERN Stack Development"
  const mernCourseData = {
    title: 'MERN Fundamentals & Full-Stack Mastery',
    slug: 'mern-fundamentals-full-stack',
    subtitle: 'Build production-ready web apps with React & Node',
    description: 'Learn MongoDB, Express.js, React 19, and Node.js from scratch. Create RESTful APIs, handle authentication, state management, and Cloudinary image uploads.',
    category: categories.mern._id,
    type: 'hybrid' as const,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
    previewVideo: SAMPLE_VIDEOS[1],
    price: 1299,
    discountPrice: 999,
    rating: 4.8,
    ratingCount: 92,
    instructor: {
      name: 'Priti Singh',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
      title: 'Lead Full-Stack Developer',
    },
    sections: [
      {
        title: 'Frontend Basics',
        order: 1,
        lectures: [
          { title: 'React 19 Components & JSX', duration: '14:20', videoUrl: SAMPLE_VIDEOS[1], isPreview: true },
          { title: 'State Management & Hooks', duration: '18:50', videoUrl: SAMPLE_VIDEOS[2], isPreview: false },
        ],
      },
      {
        title: 'Backend Basics',
        order: 2,
        lectures: [
          { title: 'Express Routing & Middleware', duration: '16:40', videoUrl: SAMPLE_VIDEOS[3], isPreview: false },
          { title: 'MongoDB Schemas & Mongoose Models', duration: '21:10', videoUrl: SAMPLE_VIDEOS[4], isPreview: false },
        ],
      },
    ],
    liveSchedule: {
      startTime: new Date(now.getTime() - 10 * 60 * 1000), //Started 10 mins ago -> Currently LIVE!
      endTime: new Date(now.getTime() + 50 * 60 * 1000),
      meetingUrl: 'https://meet.google.com/live-mern-stream',
      status: 'live' as const,
    },
    isPublished: true,
    isFeatured: true,
    isSuggested: true,
  };

  // 3. COURSE: "Intro to Data Science"
  const dataScienceCourseData = {
    title: 'Intro to Data Science & Python',
    slug: 'intro-to-data-science-python',
    subtitle: 'Data Analysis, Pandas, Matplotlib & Machine Learning',
    description: 'Master data analysis in Python using NumPy, Pandas, Matplotlib, and Scikit-Learn. Clean real datasets, visualize trends, and train machine learning models.',
    category: categories.dataScience._id,
    type: 'recorded' as const,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
    previewVideo: SAMPLE_VIDEOS[2],
    price: 1499,
    discountPrice: 1199,
    rating: 4.7,
    ratingCount: 64,
    instructor: {
      name: 'Rohan Mehta',
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
      title: 'Data Scientist & ML Researcher',
    },
    sections: [
      {
        title: 'Python for Data Science',
        order: 1,
        lectures: [
          { title: 'NumPy Vectorized Operations', duration: '15:10', videoUrl: SAMPLE_VIDEOS[2], isPreview: true },
          { title: 'Pandas DataFrames & Manipulation', duration: '22:30', videoUrl: SAMPLE_VIDEOS[3], isPreview: false },
        ],
      },
      {
        title: 'Data Visualization',
        order: 2,
        lectures: [
          { title: 'Matplotlib Line & Scatter Plots', duration: '13:45', videoUrl: SAMPLE_VIDEOS[4], isPreview: false },
          { title: 'Seaborn Heatmaps & Statistical Charts', duration: '17:20', videoUrl: SAMPLE_VIDEOS[0], isPreview: false },
        ],
      },
    ],
    isPublished: true,
    isFeatured: true,
    isSuggested: true,
  };

  // 4. COURSE: "UI/UX Foundations"
  const uiUxCourseData = {
    title: 'UI/UX Design Foundations',
    slug: 'ui-ux-design-foundations',
    subtitle: 'Figma Prototyping, Design Systems & User Research',
    description: 'Learn wireframing, high-fidelity UI design in Figma, typography, color palettes, responsive layouts, and conducting user interviews for UX design.',
    category: categories.uiUx._id,
    type: 'live' as const,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600',
    previewVideo: SAMPLE_VIDEOS[3],
    price: 899,
    discountPrice: 699,
    rating: 4.8,
    ratingCount: 78,
    instructor: {
      name: 'Sneha Iyer',
      photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250',
      title: 'Product Design Lead',
    },
    sections: [
      {
        title: 'Design Principles',
        order: 1,
        lectures: [
          { title: 'Color Theory & Accessibility', duration: '12:00', videoUrl: SAMPLE_VIDEOS[3], isPreview: true },
          { title: 'Typography Hierarchy & Spacing', duration: '16:15', videoUrl: SAMPLE_VIDEOS[4], isPreview: false },
        ],
      },
      {
        title: 'Prototyping',
        order: 2,
        lectures: [
          { title: 'Figma Frames & Auto-Layout', duration: '19:40', videoUrl: SAMPLE_VIDEOS[0], isPreview: false },
          { title: 'Interactive Prototypes & Micro-Animations', duration: '24:10', videoUrl: SAMPLE_VIDEOS[1], isPreview: false },
        ],
      },
    ],
    liveSchedule: {
      startTime: futureDate,
      endTime: new Date(futureDate.getTime() + 60 * 60 * 1000),
      meetingUrl: 'https://meet.google.com/upcoming-uiux-class',
      status: 'scheduled' as const,
    },
    isPublished: true,
    isFeatured: true,
    isSuggested: true,
  };

  // 5. COURSE: "Digital Marketing Basics"
  const digitalMarketingCourseData = {
    title: 'Digital Marketing & Growth Essentials',
    slug: 'digital-marketing-growth-essentials',
    subtitle: 'SEO, Content Strategy & Social Media Analytics',
    description: 'Learn Search Engine Optimization, Google Ads campaigns, keyword strategy, social media branding, email marketing, and conversion rate optimization.',
    category: categories.digitalMarketing._id,
    type: 'recorded' as const,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
    previewVideo: SAMPLE_VIDEOS[4],
    price: 499,
    discountPrice: 399,
    rating: 4.6,
    ratingCount: 52,
    instructor: {
      name: 'Karan Singh',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      title: 'Digital Growth Specialist',
    },
    sections: [
      {
        title: 'SEO Essentials',
        order: 1,
        lectures: [
          { title: 'Keyword Research & Intent', duration: '11:30', videoUrl: SAMPLE_VIDEOS[4], isPreview: true },
          { title: 'On-Page SEO & Meta Tags', duration: '15:20', videoUrl: SAMPLE_VIDEOS[0], isPreview: false },
        ],
      },
      {
        title: 'Social Media Marketing',
        order: 2,
        lectures: [
          { title: 'Content Calendar & Strategy', duration: '14:50', videoUrl: SAMPLE_VIDEOS[1], isPreview: false },
          { title: 'Analytics & Campaign Optimization', duration: '18:10', videoUrl: SAMPLE_VIDEOS[2], isPreview: false },
        ],
      },
    ],
    isPublished: true,
    isFeatured: true,
    isSuggested: true,
  };

  const coursesList = [
    appliedMathCourseData,
    mernCourseData,
    dataScienceCourseData,
    uiUxCourseData,
    digitalMarketingCourseData,
  ];

  const resultMap: Record<string, ICourse> = {};

  for (const item of coursesList) {
    let course = await CourseModel.findOneAndUpdate(
      { slug: item.slug },
      { $set: item },
      { new: true, upsert: true }
    );
    console.log(`  ✓ Seeded/Updated course: "${item.title}" with valid video streams`);
    resultMap[item.slug] = course;
  }

  return {
    appliedMathCourse: resultMap['applied-mathematics-masterclass'],
    mernCourse: resultMap['mern-fundamentals-full-stack'],
    dataScienceCourse: resultMap['intro-to-data-science-python'],
    uiUxCourse: resultMap['ui-ux-design-foundations'],
    digitalMarketingCourse: resultMap['digital-marketing-growth-essentials'],
  };
}
