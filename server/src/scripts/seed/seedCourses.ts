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

  // Fetch categories
  const catDigital = await CategoryModel.findOne({ slug: 'digital-marketing-ads' });
  const catAI = await CategoryModel.findOne({ slug: 'ai-prompt-tools' });
  const catFreelancing = await CategoryModel.findOne({ slug: 'freelancing-earning-online' });
  const catDesign = await CategoryModel.findOne({ slug: 'design-video-editing' });
  const catSales = await CategoryModel.findOne({ slug: 'sales-career-skills' });

  if (!catDigital || !catAI || !catFreelancing || !catDesign || !catSales) {
    throw new Error('Categories must be seeded before seeding courses.');
  }

  // 1. Showcase Course: Google Ads (Digital Marketing & Ads)
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
  if (!existingGoogleAds) {
    await CourseModel.create({
      title: 'Google Ads',
      slug: 'google-ads',
      subtitle: 'Master Search, Display, Shopping, and YouTube Video Campaigns',
      description: 'Comprehensive step-by-step masterclass on Google Ads. Learn keyword research, bidding strategies, ad copy creation, quality score optimization, and ROI tracking for scalable campaign growth.',
      category: catDigital._id,
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
        startTime: new Date(Date.now() - 3600000), // 1 hr ago
        endTime: new Date(Date.now() + 3600000), // 1 hr in future
        meetingUrl: 'https://meet.google.com/abc-defg-hij',
        status: 'live',
      },
      isPublished: true,
      isFeatured: true,
      isSuggested: true,
    });
    console.log('  └─ Created Showcase Course: Google Ads');
  } else {
    await CourseModel.updateOne({ slug: 'google-ads' }, { $set: { sections: googleAdsSections, previewVideo: SAMPLE_VIDEOS[5] } });
    console.log('  └─ Updated Showcase Course: Google Ads (Direct Video URLs Attached)');
  }

  // 2. Fully-Built Course 2: ChatGPT & AI Tools (Recorded-only)
  const chatGPTSections = [
    {
      title: 'Topic 1: Getting Started with ChatGPT',
      order: 1,
      lectures: [
        { title: 'Intro to Generative AI', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[0], isPreview: true },
        { title: 'Crafting Effective Prompts', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[1], isPreview: false },
      ],
    },
    {
      title: 'Topic 2: AI Tools for Productivity',
      order: 2,
      lectures: [
        { title: 'Automating Workflow with Midjourney & Claude', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[2], isPreview: false },
        { title: 'Building Custom GPTs', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[3], isPreview: false },
      ],
    },
  ];

  const existingChatGPT = await CourseModel.findOne({ slug: 'chatgpt-ai-tools' });
  if (!existingChatGPT) {
    await CourseModel.create({
      title: 'ChatGPT & AI Tools',
      slug: 'chatgpt-ai-tools',
      subtitle: 'Automate Content Creation, Code, and Daily Workflows with AI',
      description: 'Learn how to leverage ChatGPT, Midjourney, Claude, and custom GPTs to 10x your productivity and automate repetitive tasks.',
      category: catAI._id,
      type: 'recorded',
      thumbnail: THUMBNAILS[1],
      previewVideo: SAMPLE_VIDEOS[0],
      maxPreviewViews: 3,
      price: 799,
      discountPrice: 499,
      rating: 4.8,
      ratingCount: 215,
      sections: chatGPTSections,
      isPublished: true,
      isFeatured: true,
    });
    console.log('  └─ Created Course: ChatGPT & AI Tools');
  } else {
    await CourseModel.updateOne({ slug: 'chatgpt-ai-tools' }, { $set: { sections: chatGPTSections, previewVideo: SAMPLE_VIDEOS[0] } });
    console.log('  └─ Updated Course: ChatGPT & AI Tools (Direct Video URLs Attached)');
  }

  // 3. Fully-Built Course 3: Freelancing Guide (Live-only)
  const existingFreelancing = await CourseModel.findOne({ slug: 'freelancing-guide' });
  if (!existingFreelancing) {
    await CourseModel.create({
      title: 'Freelancing Guide',
      slug: 'freelancing-guide',
      subtitle: 'Complete Roadmap to Land High-Paying International Clients',
      description: 'Live coaching program covering Upwork profile setup, proposal writing, portfolio building, and client retention.',
      category: catFreelancing._id,
      type: 'live',
      thumbnail: THUMBNAILS[2],
      previewVideo: SAMPLE_VIDEOS[2],
      maxPreviewViews: 3,
      price: 999,
      discountPrice: 699,
      rating: 4.9,
      ratingCount: 180,
      sections: [],
      liveSchedule: {
        startTime: new Date(Date.now() + 86400000), // Tomorrow
        endTime: new Date(Date.now() + 90000000),
        meetingUrl: 'https://meet.google.com/freelance-live-room',
        status: 'scheduled',
      },
      isPublished: true,
      isFeatured: true,
    });
    console.log('  └─ Created Course: Freelancing Guide');
  }

  // 4. Fully-Built Course 4: Canva Mastery (Hybrid)
  const canvaSections = [
    {
      title: 'Topic 1: Canva Basics',
      order: 1,
      lectures: [
        { title: 'Navigating the Workspace', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[3], isPreview: true },
        { title: 'Typography & Color Palette Rules', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[4], isPreview: false },
      ],
    },
    {
      title: 'Topic 2: Creating Social Media Designs',
      order: 2,
      lectures: [
        { title: 'Designing Viral Instagram Reels & Carousels', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[5], isPreview: false },
        { title: 'Exporting Assets for Print & Web', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[6], isPreview: false },
      ],
    },
  ];

  const existingCanva = await CourseModel.findOne({ slug: 'canva-mastery' });
  if (!existingCanva) {
    await CourseModel.create({
      title: 'Canva Mastery',
      slug: 'canva-mastery',
      subtitle: 'Design Professional Social Media Assets & Brand Kits',
      description: 'Step-by-step masterclass to design stunning banners, Reels graphics, YouTube thumbnails, and brand pitch decks using Canva.',
      category: catDesign._id,
      type: 'hybrid',
      thumbnail: THUMBNAILS[3],
      previewVideo: SAMPLE_VIDEOS[3],
      maxPreviewViews: 3,
      price: 599,
      discountPrice: 399,
      rating: 4.7,
      ratingCount: 190,
      sections: canvaSections,
      liveSchedule: {
        startTime: new Date(Date.now() - 172800000), // 2 days ago
        endTime: new Date(Date.now() - 169200000),
        meetingUrl: 'https://meet.google.com/canva-past-recording',
        status: 'ended',
      },
      isPublished: true,
      isFeatured: true,
    });
    console.log('  └─ Created Course: Canva Mastery');
  } else {
    await CourseModel.updateOne({ slug: 'canva-mastery' }, { $set: { sections: canvaSections, previewVideo: SAMPLE_VIDEOS[3] } });
    console.log('  └─ Updated Course: Canva Mastery (Direct Video URLs Attached)');
  }

  // 5. Fully-Built Course 5: Sales and Lead Generation Skills (Hybrid)
  const salesSections = [
    {
      title: 'Topic 1: Lead Generation Fundamentals',
      order: 1,
      lectures: [
        { title: 'Cold Outreach via LinkedIn & Email', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[7], isPreview: true },
        { title: 'Building High-Converting Prospect Lists', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[8], isPreview: false },
      ],
    },
    {
      title: 'Topic 2: Closing Techniques',
      order: 2,
      lectures: [
        { title: 'Overcoming Price Objections', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[9], isPreview: false },
        { title: 'Structuring High-Ticket Deals', duration: '15 sec', videoUrl: SAMPLE_VIDEOS[0], isPreview: false },
      ],
    },
  ];

  const existingSales = await CourseModel.findOne({ slug: 'sales-lead-generation-skills' });
  if (!existingSales) {
    await CourseModel.create({
      title: 'Sales and Lead Generation Skills',
      slug: 'sales-lead-generation-skills',
      subtitle: 'B2B Sales Prospecting, Cold Calling & Closing Mastery',
      description: 'Master B2B outreach strategies, high-converting cold email sequences, discovery calls, and objection closing.',
      category: catSales._id,
      type: 'hybrid',
      thumbnail: THUMBNAILS[4],
      previewVideo: SAMPLE_VIDEOS[4],
      maxPreviewViews: 3,
      price: 1299,
      discountPrice: 899,
      rating: 4.8,
      ratingCount: 165,
      sections: salesSections,
      liveSchedule: {
        startTime: new Date(Date.now() + 172800000), // 2 days in future
        endTime: new Date(Date.now() + 176400000),
        meetingUrl: 'https://meet.google.com/sales-live-room',
        status: 'scheduled',
      },
      isPublished: true,
      isFeatured: true,
    });
    console.log('  └─ Created Course: Sales and Lead Generation Skills');
  } else {
    await CourseModel.updateOne({ slug: 'sales-lead-generation-skills' }, { $set: { sections: salesSections } });
    console.log('  └─ Updated Course: Sales and Lead Generation Skills (Direct Video URLs Attached)');
  }

  // Remaining 25 Courses — Basic Records Only
  const remainingCourses = [
    { title: 'Blogging', slug: 'blogging', category: catDigital._id, price: 499 },
    { title: 'Pinterest Marketing', slug: 'pinterest-marketing', category: catDigital._id, price: 599 },
    { title: 'Google Ads Advanced', slug: 'google-ads-advanced', category: catDigital._id, price: 1499 },
    { title: 'SEO', slug: 'seo', category: catDigital._id, price: 899 },
    { title: 'Email Marketing', slug: 'email-marketing', category: catDigital._id, price: 699 },
    { title: 'Dominate Content', slug: 'dominate-content', category: catDigital._id, price: 799 },
    { title: 'Organic Marketing Mastery', slug: 'organic-marketing-mastery', category: catDigital._id, price: 899 },
    { title: 'WhatsApp Marketing', slug: 'whatsapp-marketing', category: catDigital._id, price: 599 },
    { title: 'Gen AI Digital Marketing', slug: 'gen-ai-digital-marketing', category: catDigital._id, price: 999 },
    { title: 'Meta Ads', slug: 'meta-ads', category: catDigital._id, price: 1199 },
    { title: 'Gen AI - Website Design', slug: 'gen-ai-website-design', category: catAI._id, price: 899 },
    { title: 'Mastering AI Resume Writing', slug: 'mastering-ai-resume-writing', category: catAI._id, price: 499 },
    { title: 'Prompt Engineering', slug: 'prompt-engineering', category: catAI._id, price: 799 },
    { title: 'AI Faceless YouTube', slug: 'ai-faceless-youtube', category: catAI._id, price: 999 },
    { title: 'AI Faceless Instagram', slug: 'ai-faceless-instagram', category: catAI._id, price: 899 },
    { title: 'Affiliate Marketing', slug: 'affiliate-marketing', category: catFreelancing._id, price: 799 },
    { title: 'Amazon Associate Program', slug: 'amazon-associate-program', category: catFreelancing._id, price: 599 },
    { title: 'Meesho Reselling', slug: 'meesho-reselling', category: catFreelancing._id, price: 499 },
    { title: 'Real Estate Lead Generation', slug: 'real-estate-lead-generation', category: catFreelancing._id, price: 1299 },
    { title: 'Inshot Video Editing', slug: 'inshot-video-editing', category: catDesign._id, price: 499 },
    { title: 'Capcut Video Editing', slug: 'capcut-video-editing', category: catDesign._id, price: 599 },
    { title: 'Objection Handling', slug: 'objection-handling', category: catSales._id, price: 699 },
    { title: 'HR Training', slug: 'hr-training', category: catSales._id, price: 899 },
    { title: 'Communication Training', slug: 'communication-training', category: catSales._id, price: 599 },
    { title: 'Mindset Improvement', slug: 'mindset-improvement', category: catSales._id, price: 499 },
    { title: 'MS Excel Advanced', slug: 'ms-excel-advanced', category: catSales._id, price: 799 },
  ];

  for (let i = 0; i < remainingCourses.length; i++) {
    const c = remainingCourses[i];
    const existing = await CourseModel.findOne({ slug: c.slug });
    if (!existing) {
      await CourseModel.create({
        title: c.title,
        slug: c.slug,
        subtitle: `Master ${c.title} with practical, real-world examples.`,
        description: `Complete guide on ${c.title}. Designed for beginner to advanced learners looking to build practical skillsets.`,
        category: c.category,
        type: 'recorded',
        thumbnail: THUMBNAILS[i % THUMBNAILS.length],
        previewVideo: SAMPLE_VIDEOS[i % SAMPLE_VIDEOS.length],
        maxPreviewViews: 3,
        price: c.price,
        discountPrice: Math.round(c.price * 0.7),
        rating: 4.7 + (i % 3) * 0.1,
        ratingCount: 50 + i * 5,
        sections: [],
        isPublished: true,
        isFeatured: false,
      });
      console.log(`  └─ Created Basic Course: ${c.title}`);
    }
  }

  console.log('✅ Courses Seeding Complete.\n');
}
