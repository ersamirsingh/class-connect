import { CourseModel } from '../../modules/course/course.model';
import { CategoryModel } from '../../modules/category/category.model';

const SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback2012.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
];

const THUMBNAILS = [
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1542744094-3a3172720189?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600',
];

export async function seedCourses() {
  console.log('📚 Seeding Courses...');

  const catWeb = await CategoryModel.findOne({ slug: 'web-development' });
  const catApp = await CategoryModel.findOne({ slug: 'app-development' });
  const catUIUX = await CategoryModel.findOne({ slug: 'ui-ux-design' });
  const catAI = await CategoryModel.findOne({ slug: 'ai-data-science' });
  const catDigital = await CategoryModel.findOne({ slug: 'digital-marketing' });
  const catCyber = await CategoryModel.findOne({ slug: 'cyber-security-cloud' });

  const webId = catWeb?._id;
  const appId = catApp?._id;
  const uiuxId = catUIUX?._id;
  const aiId = catAI?._id;
  const digitalId = catDigital?._id;
  const cyberId = catCyber?._id;

  // 1. Showcase Course: Google Ads (Digital Marketing)
  const googleAdsSections = [
    {
      title: 'Topic 1: Google Ads Fundamentals',
      order: 1,
      lectures: [
        { title: 'Introduction to Google Ads', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[5], isPreview: true },
        { title: 'Account Setup & Campaign Types', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[6], isPreview: false },
        { title: 'Understanding the Auction System', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[7], isPreview: false },
      ],
    },
    {
      title: 'Topic 2: Keyword Research & Targeting',
      order: 2,
      lectures: [
        { title: 'Keyword Research Tools', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[8], isPreview: false },
        { title: 'Match Types Explained', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[9], isPreview: false },
        { title: 'Audience Targeting', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[0], isPreview: false },
      ],
    },
    {
      title: 'Topic 3: Optimization & Reporting',
      order: 3,
      lectures: [
        { title: 'Bid Strategies', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[1], isPreview: false },
        { title: 'A/B Testing Ads', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[2], isPreview: false },
        { title: 'Reading Performance Reports', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[3], isPreview: false },
      ],
    },
  ];

  const existingGoogleAds = await CourseModel.findOne({ slug: 'google-ads' });
  if (!existingGoogleAds && digitalId) {
    await CourseModel.create({
      title: 'Google Ads Masterclass',
      slug: 'google-ads',
      subtitle: 'Master Search, Display, Shopping, and YouTube Video Campaigns',
      description: 'Comprehensive step-by-step masterclass on Google Ads. Learn keyword research, bidding strategies, ad copy creation, quality score optimization, and ROI tracking.',
      category: digitalId,
      type: 'hybrid',
      thumbnail: THUMBNAILS[0],
      coverImage: THUMBNAILS[0],
      previewVideo: SAMPLE_VIDEOS[5],
      maxPreviewViews: 3,
      price: 1499,
      discountPrice: 999,
      rating: 4.9,
      ratingCount: 340,
      instructor: {
        name: 'Samir Singh',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        title: 'Google Ads Certified Specialist',
      },
      sections: googleAdsSections,
      liveSchedule: {
        startTime: new Date(Date.now() - 3600000),
        endTime: new Date(Date.now() + 3600000),
        meetingUrl: 'https://meet.google.com/abc-defg-hij',
        status: 'live',
      },
      isPublished: true,
      isFeatured: true,
    });
    console.log('  └─ Created Showcase Course: Google Ads');
  }

  // 2. Showcase Course: ChatGPT & Prompt Engineering (AI & Data Science)
  const chatGptSections = [
    {
      title: 'Topic 1: Prompt Engineering Foundations',
      order: 1,
      lectures: [
        { title: 'Prompt Anatomy & Persona Control', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[0], isPreview: true },
        { title: 'Zero-Shot vs Few-Shot Prompting', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[1], isPreview: false },
        { title: 'Chain-of-Thought Reasoning', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[2], isPreview: false },
      ],
    },
  ];

  const existingChatGPT = await CourseModel.findOne({ slug: 'chatgpt-prompt-engineering' });
  if (!existingChatGPT && aiId) {
    await CourseModel.create({
      title: 'ChatGPT & Prompt Engineering',
      slug: 'chatgpt-prompt-engineering',
      subtitle: 'Master Generative AI, Custom GPTs, and Advanced Prompting Workflows',
      description: 'Complete hands-on guide to mastering ChatGPT and LLM prompt engineering for productivity, automation, content creation, and business workflows.',
      category: aiId,
      type: 'recorded',
      thumbnail: THUMBNAILS[1],
      coverImage: THUMBNAILS[1],
      previewVideo: SAMPLE_VIDEOS[0],
      maxPreviewViews: 3,
      price: 1299,
      discountPrice: 799,
      rating: 4.8,
      ratingCount: 215,
      instructor: {
        name: 'Rohan Sharma',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
        title: 'AI Product Lead',
      },
      sections: chatGptSections,
      isPublished: true,
      isFeatured: true,
    });
    console.log('  └─ Created Showcase Course: ChatGPT & Prompt Engineering');
  }

  // Batch Courses
  const remainingCourses = [
    { title: 'Fullstack Web Architecture', slug: 'fullstack-web-architecture', category: webId, price: 1799 },
    { title: 'React 19 & Server Components Masterclass', slug: 'react-19-server-components', category: webId, price: 1599 },
    { title: 'React Native Cross-Platform Masterclass', slug: 'react-native-cross-platform', category: appId, price: 1499 },
    { title: 'Flutter & Dart iOS & Android Apps', slug: 'flutter-app-masterclass', category: appId, price: 1399 },
    { title: 'Figma UI/UX & Design Systems', slug: 'figma-ui-ux-systems', category: uiuxId, price: 1199 },
    { title: 'Motion Design & Visual Prototyping', slug: 'motion-design-prototyping', category: uiuxId, price: 1299 },
    { title: 'AWS Cloud Architecture & DevOps', slug: 'aws-cloud-devops', category: cyberId, price: 1999 },
    { title: 'Ethical Hacking & Network Security', slug: 'ethical-hacking-security', category: cyberId, price: 1899 },
    { title: 'SEO & Performance Marketing', slug: 'seo-performance-marketing', category: digitalId, price: 899 },
    { title: 'AI Engineering & LLM Integration', slug: 'ai-engineering-workshop', category: aiId, price: 1499 },
  ];

  for (const c of remainingCourses) {
    if (!c.category) continue;
    const existing = await CourseModel.findOne({ slug: c.slug });
    if (!existing) {
      await CourseModel.create({
        title: c.title,
        slug: c.slug,
        subtitle: `Master ${c.title} with practical, real-world examples.`,
        description: `Complete guide on ${c.title}. Designed for beginner to advanced learners looking to build practical skillsets.`,
        category: c.category,
        type: 'recorded',
        thumbnail: THUMBNAILS[3],
        price: c.price,
        rating: 4.8,
        ratingCount: 150,
        isPublished: true,
        isFeatured: true,
      });
    }
  }

  console.log('✅ Courses Seeding Complete.\n');
}
