import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';

const bunnyStorageApiKey = '549dd8a8-06e1-4f61-99849942ab86-ca44-4d3c';
const bunnyStorageZone = 'class-connect';
const bunnyCdnHost = 'https://class-connect.b-cdn.net';
const mongoUri = 'mongodb://mainhunloki:Sam4Code00@ac-avpidra-shard-00-00.7xcxlt8.mongodb.net:27017,ac-avpidra-shard-00-01.7xcxlt8.mongodb.net:27017,ac-avpidra-shard-00-02.7xcxlt8.mongodb.net:27017/class-connect?ssl=true&authSource=admin';

const contentBlockSchema = new Schema(
  {
    page: { type: String, required: true, default: 'home', index: true },
    section: { type: String, required: true, index: true },
    title: { type: String, default: '', trim: true },
    subtitle: { type: String, default: '' },
    data: { type: Schema.Types.Mixed, default: {} },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ContentBlockModel = mongoose.models.ContentBlock || model('ContentBlock', contentBlockSchema);

// Image assets to upload to Bunny Storage
const assetsToUpload = [
  { key: 'hero_main', folder: 'cms', filename: 'hero_students_main.jpg', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200' },
  { key: 'banner_live', folder: 'cms', filename: 'banner_live_interactive.jpg', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000' },
  
  // Student Batch Zero Photos
  { key: 'student_meera', folder: 'cms', filename: 'student_meera_nair.jpg', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
  { key: 'student_rohan', folder: 'cms', filename: 'student_rohan_sharma.jpg', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80' },
  { key: 'student_ananya', folder: 'cms', filename: 'student_ananya_verma.jpg', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80' },
  { key: 'student_vikram', folder: 'cms', filename: 'student_vikram_mehta.jpg', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80' },
  
  // Workshop Banners
  { key: 'workshop_react', folder: 'cms', filename: 'workshop_react19_masterclass.jpg', url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80' },
  { key: 'workshop_microservices', folder: 'cms', filename: 'workshop_microservices_architecture.jpg', url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80' },
  { key: 'workshop_ai', folder: 'cms', filename: 'workshop_ai_llm_agents.jpg', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
  
  // Testimonial Avatars
  { key: 'testimonial_kavita', folder: 'cms', filename: 'testimonial_kavita_patel.jpg', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
  { key: 'testimonial_arjun', folder: 'cms', filename: 'testimonial_arjun_singhania.jpg', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80' },
  
  // Video Review Posters
  { key: 'poster_priya', folder: 'cms', filename: 'video_poster_priya.jpg', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80' },
  { key: 'poster_aarav', folder: 'cms', filename: 'video_poster_aarav.jpg', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80' },
];

async function uploadFileToBunny(imageBuffer, folder, filename, mimeType) {
  const targetPath = `${folder}/${filename}`;
  const uploadUrl = `https://storage.bunnycdn.com/${bunnyStorageZone}/${targetPath}`;
  
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      AccessKey: bunnyStorageApiKey,
      'Content-Type': mimeType || 'image/jpeg'
    },
    body: imageBuffer
  });

  if (!res.ok) {
    throw new Error(`Failed to upload to Bunny Storage: HTTP ${res.status} ${res.statusText}`);
  }

  const cdnUrl = `${bunnyCdnHost}/${targetPath}`;
  return cdnUrl;
}

async function runSeed() {
  console.log('🚀 Starting Bunny Storage CMS Media Upload...');
  const uploadedUrls = {};

  for (const asset of assetsToUpload) {
    try {
      console.log(`Downloading asset: ${asset.key}...`);
      const response = await fetch(asset.url);
      if (!response.ok) throw new Error(`HTTP ${response.status} fetching ${asset.url}`);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      console.log(`Uploading ${asset.filename} to Bunny Storage...`);
      const cdnUrl = await uploadFileToBunny(buffer, asset.folder, asset.filename, 'image/jpeg');
      uploadedUrls[asset.key] = cdnUrl;
      console.log(`✅ Uploaded ${asset.key} -> ${cdnUrl}`);
    } catch (err) {
      console.error(`❌ Error uploading ${asset.key}:`, err.message);
      uploadedUrls[asset.key] = asset.url; // fallback if remote fetch fails
    }
  }

  console.log('\n📦 Connecting to MongoDB...');
  await mongoose.connect(mongoUri);
  console.log('CONNECTED to MongoDB!');

  const cmsBlocks = [
    {
      page: 'home',
      section: 'hero',
      title: 'Master New Skills With Visual Learning',
      subtitle: 'Interactive video lessons, live classes, and expert guidance designed for visual thinkers.',
      data: {
        imageUrl: uploadedUrls['hero_main'],
        ctaText: 'Explore Courses',
        ctaLink: '/courses',
        badge: 'Visual-First EdTech Platform',
      },
      order: 1,
      isActive: true,
    },
    {
      page: 'home',
      section: 'banner',
      title: 'Live Interactive Classes Daily',
      subtitle: 'Join live sessions with top instructors and solve real problems together.',
      data: {
        imageUrl: uploadedUrls['banner_live'],
        ctaText: 'View Live Schedule',
        ctaLink: '/courses',
        tag: 'Live Now',
      },
      order: 2,
      isActive: true,
    },
    {
      page: 'home',
      section: 'student-results',
      title: 'Real Results from Batch Zero',
      subtitle: 'Proven career transitions from our initial visual learning cohort.',
      data: {
        headlineMetric: '100% of graduates secured paid industry opportunities.',
        ctcStat: '₹16.8 LPA Combined Average CTC',
        students: [
          {
            id: 'student-1',
            name: 'Meera Nair',
            role: 'Full-Stack Developer @ Zomato',
            company: 'Zomato Tech',
            packageCTC: '₹18.5 LPA Package',
            avatarUrl: uploadedUrls['student_meera'],
            rating: 5,
            review: 'Learning React 19 and Node.js microservices visually transformed my portfolio and landed me my dream role at Zomato!',
            batch: 'Batch Zero 2026'
          },
          {
            id: 'student-2',
            name: 'Rohan Sharma',
            role: 'Frontend Engineer @ Swiggy',
            company: 'Swiggy Tech',
            packageCTC: '₹16.0 LPA Package',
            avatarUrl: uploadedUrls['student_rohan'],
            rating: 5,
            review: 'The bilingual Hindi & English live sessions gave me total clarity on frontend architecture. Got hired within 2 months!',
            batch: 'Batch Zero 2026'
          },
          {
            id: 'student-3',
            name: 'Ananya Verma',
            role: 'UI/UX Product Designer @ CRED',
            company: 'CRED Design',
            packageCTC: '₹21.0 LPA Package',
            avatarUrl: uploadedUrls['student_ananya'],
            rating: 5,
            review: 'Mastering Figma design systems and motion UI under senior design leaders elevated my design portfolio to top tier.',
            batch: 'Batch Zero 2026'
          },
          {
            id: 'student-4',
            name: 'Vikram Mehta',
            role: 'AI Systems Engineer @ FinTech Scaleup',
            company: 'Razorpay',
            packageCTC: '₹24.5 LPA Package',
            avatarUrl: uploadedUrls['student_vikram'],
            rating: 5,
            review: 'Building production LLM AI agents step by step gave me immediate confidence to crack senior technical interviews.',
            batch: 'Batch Zero 2026'
          }
        ]
      },
      order: 3,
      isActive: true,
    },
    {
      page: 'home',
      section: 'live-classes',
      title: 'Live Classes & Interactive Workshops',
      subtitle: 'Hands-on live coding sessions with industry mentors and live Q&A.',
      data: {
        items: [
          {
            id: 'live-1',
            status: 'LIVE NOW',
            isLiveNow: true,
            registered: '340 registered',
            title: 'Advanced React 19 & Server Components Masterclass',
            host: 'Rohan Sharma',
            type: 'Interactive Live Class',
            actionText: 'Join Live Room',
            image: uploadedUrls['workshop_react']
          },
          {
            id: 'live-2',
            status: 'Tomorrow • 6:00 PM IST',
            isLiveNow: false,
            registered: '285 registered',
            title: 'Full-Stack Microservices Architecture & System Design',
            host: 'Sneha Gupta',
            type: 'Interactive Session',
            actionText: 'Reserve Spot',
            image: uploadedUrls['workshop_microservices']
          },
          {
            id: 'live-3',
            status: 'Saturday • 8:00 PM IST',
            isLiveNow: false,
            registered: '490 registered',
            title: 'AI Engineering & Custom LLM Agent Development',
            host: 'Vikram Mehta',
            type: 'Live Workshop',
            actionText: 'Reserve Spot',
            image: uploadedUrls['workshop_ai']
          }
        ]
      },
      order: 4,
      isActive: true,
    },
    {
      page: 'home',
      section: 'testimonial',
      title: 'Student Love Stories',
      subtitle: 'Real stories from visual learners who transformed their careers.',
      data: {
        items: [
          {
            id: 't-1',
            name: 'Kavita Patel',
            role: 'Full-Stack Developer @ TechCorp',
            quote: 'The bilingual Hindi & English visual walk-throughs helped me grasp complex data structures instantly. Best platform for career switchers!',
            avatar: uploadedUrls['testimonial_kavita'],
            rating: 5
          },
          {
            id: 't-2',
            name: 'Arjun Singhania',
            role: 'Backend Architect @ Scaleup',
            quote: 'Building real microservices projects during live classes gave me portfolio projects that recruiters noticed immediately.',
            avatar: uploadedUrls['testimonial_arjun'],
            rating: 5
          }
        ]
      },
      order: 5,
      isActive: true,
    },
    {
      page: 'home',
      section: 'video-testimonials',
      title: 'Real Video Reviews from Learners',
      subtitle: 'Hear directly from our students about their visual learning journey.',
      data: {
        items: [
          {
            id: 'v1',
            studentName: 'Priya Sundaram',
            role: 'Full-Stack Engineer',
            hikeStat: '50% Salary Increase',
            quote: 'Being able to ask questions live in Hindi gave me complete confidence to clear technical rounds.',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            posterUrl: uploadedUrls['poster_priya']
          },
          {
            id: 'v2',
            studentName: 'Aarav Kumar',
            role: 'UI/UX Designer',
            hikeStat: '100% Placement Success',
            quote: 'The hands-on visual cards and Figma design system projects elevated my portfolio to senior level.',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            posterUrl: uploadedUrls['poster_aarav']
          }
        ]
      },
      order: 6,
      isActive: true,
    },
    {
      page: 'home',
      section: 'faqs',
      title: 'Frequently Asked Questions',
      subtitle: 'Everything you need to know about ClassConnect learning OS.',
      data: {
        items: [
          {
            id: 'faq-1',
            question: 'Do I get full lifetime access?',
            answer: 'Yes! Once enrolled, you receive full lifetime access to all video lessons, project source code repositories, live class recordings, and future updates.'
          },
          {
            id: 'faq-2',
            question: 'Are the courses taught in Hindi or English?',
            answer: 'Our courses feature a bilingual learning system — technical terms are explained in English with step-by-step practical walk-throughs in clear Hindi and English.'
          },
          {
            id: 'faq-3',
            question: 'Will I receive a verifiable certificate upon completion?',
            answer: 'Yes! Upon completing 90% of the course and finishing projects, you receive a QR-verifiable certificate shareable on LinkedIn and your resume.'
          }
        ]
      },
      order: 7,
      isActive: true,
    },
    {
      page: 'home',
      section: 'featured_courses',
      title: 'Featured courses',
      subtitle: 'Hand-picked by our experts, these courses represent the best of what ClassConnect has to offer.',
      data: {
        courseIds: [],
      },
      order: 8,
      isActive: true,
    },
  ];

  console.log('Clearing existing CMS content blocks in MongoDB...');
  await ContentBlockModel.deleteMany({ page: 'home' });

  console.log('Inserting Bunny CDN CMS content blocks into MongoDB...');
  await ContentBlockModel.insertMany(cmsBlocks);

  console.log('🎉 SUCCESS! All CMS images pushed to Bunny Storage & MongoDB updated with 100% Bunny CDN URLs!');
  await mongoose.disconnect();
  process.exit(0);
}

runSeed();
