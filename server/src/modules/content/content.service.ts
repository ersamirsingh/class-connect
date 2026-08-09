import { ContentBlockModel, IContentBlock } from './content.model';
import { CourseModel } from '../course/course.model';

const DEFAULT_CONTENT_BLOCKS = [
  {
    page: 'home',
    section: 'hero',
    title: 'Master New Skills With Visual Learning',
    subtitle: 'Interactive video lessons, live classes, and expert guidance designed for visual thinkers.',
    data: {
      imageUrl: 'https://class-connect.b-cdn.net/cms/hero_desktop.jpg',
      desktopImageUrl: 'https://class-connect.b-cdn.net/cms/hero_desktop.jpg',
      mobileImageUrl: 'https://class-connect.b-cdn.net/cms/hero_mobile.jpg',
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
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
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
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
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
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
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
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
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
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
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
          image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80'
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
          image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
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
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
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
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
          rating: 5
        },
        {
          id: 't-2',
          name: 'Arjun Singhania',
          role: 'Backend Architect @ Scaleup',
          quote: 'Building real microservices projects during live classes gave me portfolio projects that recruiters noticed immediately.',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
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
          posterUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 'v2',
          studentName: 'Aarav Kumar',
          role: 'UI/UX Designer',
          hikeStat: '100% Placement Success',
          quote: 'The hands-on visual cards and Figma design system projects elevated my portfolio to senior level.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          posterUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
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
  {
    page: 'home',
    section: 'how-it-works',
    title: 'HOW CLASSCONNECT WORKS',
    subtitle: '4 simple steps from zero knowledge to high-income career confidence.',
    data: {
      steps: [
        {
          step: '01',
          title: 'Select Skill Track',
          desc: 'Choose from curated career paths in Fullstack, AI, Mobile, UI/UX, or Marketing.'
        },
        {
          step: '02',
          title: 'Visual Micro-Lessons',
          desc: 'Watch bilingual HD video lessons engineered for clarity without fluff.'
        },
        {
          step: '03',
          title: 'Build Real Projects',
          desc: 'Code along and create portfolio projects evaluated by expert mentors.'
        },
        {
          step: '04',
          title: 'Get Certified & Hired',
          desc: 'Earn QR-verifiable certificates and land paid industry opportunities.'
        }
      ]
    },
    order: 9,
    isActive: true,
  },
  {
    page: 'home',
    section: 'stats-orbit',
    title: 'Proven Scale & Community Impact',
    subtitle: 'Thousands of visual learners achieving career breakthroughs daily.',
    data: {
      stats: [
        { label: 'Active Learners', value: '50,000+', description: 'Across 40+ countries' },
        { label: 'Course Completion Rate', value: '98%', description: '3x industry benchmark' },
        { label: 'Average Salary Hike', value: '65%', description: 'For Batch Zero alumni' },
        { label: 'Average Rating', value: '4.9/5', description: 'Based on 12,000+ reviews' }
      ],
      ctaText: 'Start Learning Today',
      ctaLink: '/courses',
      bannerImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'
    },
    order: 10,
    isActive: true,
  },
  {
    page: 'home',
    section: 'comparison-grid',
    title: 'Why Learners Choose ClassConnect',
    subtitle: 'See how ClassConnect compares against traditional bootcamps and scattered self-study videos.',
    data: {
      features: [
        { name: 'Bilingual Hindi & English Audio', classconnect: true, bootcamps: false, youtube: 'Partial' },
        { name: 'Visual-First Screen Walkthroughs', classconnect: true, bootcamps: 'Rarely', youtube: 'Unstructured' },
        { name: 'Live interactive mentor sessions', classconnect: true, bootcamps: true, youtube: false },
        { name: 'QR-Verifiable Certificates', classconnect: true, bootcamps: true, youtube: false },
        { name: 'Lifetime Access & Updates', classconnect: true, bootcamps: false, youtube: true },
        { name: 'Affordable One-Time Price', classconnect: true, bootcamps: false, youtube: true }
      ]
    },
    order: 11,
    isActive: true,
  },
  {
    page: 'home',
    section: 'constellation',
    title: 'The Connected Learning Constellation',
    subtitle: 'Every course, skill track, and mentor session is interconnected to accelerate your growth.',
    data: {
      nodes: [
        { id: 'c1', label: 'React 19 & Next.js', category: 'Web Dev', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
        { id: 'c2', label: 'Node Microservices', category: 'Backend', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
        { id: 'c3', label: 'AI Agents & LLMs', category: 'AI/ML', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
        { id: 'c4', label: 'Figma Design System', category: 'UI/UX', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' }
      ]
    },
    order: 12,
    isActive: true,
  },
  {
    page: 'about',
    section: 'hero-story',
    title: 'LEARNING SHOULD MOVE YOU FORWARD.',
    subtitle: 'ClassConnect is India\'s premier outcome-focused learning OS. Engineered for ambitious minds to master high-income skills through visual micro-lessons and real-world project execution.',
    data: {
      tag: 'CLASSCONNECT EDITORIAL ABOUT STORY',
      ctaText: 'Explore All Courses',
      ctaLink: '/courses'
    },
    order: 1,
    isActive: true,
  },
  {
    page: 'about',
    section: 'category-tiles',
    title: 'EXPLORE POPULAR DISCIPLINES',
    subtitle: 'Comprehensive visual learning tracks built for high-demand tech and design careers.',
    data: {
      tiles: [
        {
          id: 'web-development',
          title: 'WEB DEVELOPMENT',
          count: '12 Courses',
          desc: 'Master HTML, CSS, React 19, Node.js, Next.js & fullstack architecture.',
          image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
          accent: 'from-red-600 to-rose-600',
          tag: 'FULLSTACK'
        },
        {
          id: 'app-development',
          title: 'APP DEVELOPMENT',
          count: '8 Courses',
          desc: 'Build Android & iOS apps with React Native, Flutter, Swift & Mobile APIs.',
          image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
          accent: 'from-emerald-600 to-teal-600',
          tag: 'MOBILE'
        },
        {
          id: 'ui-ux-design',
          title: 'UI/UX DESIGN',
          count: '6 Courses',
          desc: 'Figma UI/UX, Motion Graphics, Premiere Pro & visual design systems.',
          image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
          accent: 'from-purple-600 to-pink-600',
          tag: 'CREATIVE'
        },
        {
          id: 'ai-data-science',
          title: 'AI & DATA SCIENCE',
          count: '10 Courses',
          desc: 'Python, Machine Learning, OpenAI APIs, LLM Agents & Data Analytics.',
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
          accent: 'from-blue-600 to-indigo-600',
          tag: 'FUTURE TECH'
        },
        {
          id: 'digital-marketing',
          title: 'DIGITAL MARKETING',
          count: '5 Courses',
          desc: 'SEO, performance marketing ads, social media growth & brand funnel strategy.',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
          accent: 'from-amber-500 to-orange-600',
          tag: 'GROWTH'
        },
        {
          id: 'cyber-security-cloud',
          title: 'CYBER SECURITY & CLOUD',
          count: '5 Courses',
          desc: 'AWS, Azure, Ethical Hacking, Network Security & DevOps infrastructure.',
          image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
          accent: 'from-teal-600 to-cyan-600',
          tag: 'SECURITY'
        }
      ]
    },
    order: 2,
    isActive: true,
  },
  {
    page: 'about',
    section: 'approach-stages',
    title: 'OUR 4-STAGE LEARNING SYSTEM',
    subtitle: 'Designed from first principles to turn beginners into job-ready practitioners.',
    data: {
      stages: [
        {
          id: 'learn',
          word: 'LEARN',
          subtitle: 'Understand concepts through visual, structured lessons.',
          desc: 'Bilingual bite-sized video modules designed for clarity without confusing jargon.',
          badge: 'STAGE 01',
          color: 'from-blue-500 to-indigo-600',
          details: ['Structured Video Lessons', 'Dual Audio (Hindi & English)', 'Lifetime Access']
        },
        {
          id: 'practice',
          word: 'PRACTICE',
          subtitle: 'Build practical skills through projects and exercises.',
          desc: 'Interactive exercises, downloadable code starter files, and real-world assignments.',
          badge: 'STAGE 02',
          color: 'from-purple-500 to-pink-600',
          details: ['Real Project Handouts', 'Interactive Exercises', 'Source Code Access']
        },
        {
          id: 'prove',
          word: 'PROVE',
          subtitle: 'Earn certificates that demonstrate what you have completed.',
          desc: 'Verify your completion with shareable digital certificates and unique validation IDs.',
          badge: 'STAGE 03',
          color: 'from-amber-500 to-orange-600',
          details: ['Shareable Verified Badges', 'Unique Certificate ID', 'LinkedIn Ready']
        },
        {
          id: 'grow',
          word: 'GROW',
          subtitle: 'Use your skills to move toward better opportunities.',
          desc: 'Apply your new knowledge directly to freelance gigs, jobs, or personal projects.',
          badge: 'STAGE 04',
          color: 'from-emerald-500 to-teal-600',
          details: ['Portfolio Ready Output', 'Career Guidance', 'Skill Advancement']
        }
      ]
    },
    order: 3,
    isActive: true,
  },
  {
    page: 'about',
    section: 'why-tabs',
    title: 'WHY CLASSCONNECT EXISTS',
    subtitle: 'The visual-first alternative to standard passive lectures.',
    data: {
      tabs: [
        {
          id: 'video',
          title: 'Visual Lessons',
          desc: 'HD video lessons designed around real screen captures, clear diagrams, and zero fluff.',
          image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 'notes',
          title: 'Structured Notes',
          desc: 'Downloadable summary cheat-sheets and step-by-step guides for quick revision.',
          image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 'project',
          title: 'Practical Project',
          desc: 'Build real portfolio pieces instead of taking passive multiple-choice quizzes.',
          image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 'certificate',
          title: 'Milestone Certificate',
          desc: 'Receive a digital completion credential that honors your dedication and effort.',
          image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
        }
      ]
    },
    order: 4,
    isActive: true,
  },
  {
    page: 'contact',
    section: 'support-info',
    title: 'Get in Touch with ClassConnect Support',
    subtitle: 'Our team is available 7 days a week to help with course access, account queries, or billing support.',
    data: {
      supportEmail: 'support@classconnect.com',
      phoneSupport: '+91 (800) 123-4567',
      workingHours: 'Mon - Sun: 9:00 AM - 9:00 PM IST',
      avgResponseTime: '< 2 hours',
      officeLocation: 'Bengaluru, Karnataka, India'
    },
    order: 1,
    isActive: true,
  },
  {
    page: 'footer',
    section: 'links-and-copy',
    title: 'ClassConnect Learning OS',
    subtitle: 'Empowering ambitious learners worldwide through visual bite-sized education and real project execution.',
    data: {
      tagline: 'Visual-First Learning OS for Ambitious Minds',
      copyrightText: '© 2026 ClassConnect Inc. All rights reserved.',
      supportEmail: 'support@classconnect.com',
      socialLinks: {
        twitter: 'https://twitter.com/classconnect',
        linkedin: 'https://linkedin.com/company/classconnect',
        youtube: 'https://youtube.com/@classconnect',
        instagram: 'https://instagram.com/classconnect',
        github: 'https://github.com/classconnect'
      },
      legalLinks: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Refund Policy', href: '/refunds' },
        { label: 'Security', href: '/security' }
      ]
    },
    order: 1,
    isActive: true,
  }
];

export class ContentService {
  static async getPublicContent(page = 'home'): Promise<any[]> {
    let blocks = await ContentBlockModel.find({ page, isActive: true }).sort({ order: 1 });

    if (blocks.length === 0) {
      const defaultForPage = DEFAULT_CONTENT_BLOCKS.filter((b) => b.page === page);
      if (defaultForPage.length > 0) {
        await ContentBlockModel.insertMany(defaultForPage);
        blocks = await ContentBlockModel.find({ page, isActive: true }).sort({ order: 1 });
      }
    }

    const plainBlocks = await Promise.all(
      blocks.map(async (block) => {
        const obj = block.toObject();
        if (obj.section === 'featured_courses' && Array.isArray(obj.data?.courseIds) && obj.data.courseIds.length > 0) {
          const rawCourses = await CourseModel.find({ _id: { $in: obj.data.courseIds } }).populate('category');
          const courseMap = new Map(rawCourses.map((c) => [c._id.toString(), c]));
          const orderedCourses = obj.data.courseIds
            .map((id: any) => courseMap.get(id.toString()))
            .filter(Boolean);
          obj.data.courses = orderedCourses;
        } else if (obj.section === 'featured_courses') {
          obj.data = obj.data || {};
          obj.data.courses = [];
        }
        return obj;
      })
    );

    return plainBlocks;
  }

  static async getAllContentAdmin(): Promise<any[]> {
    let blocks = await ContentBlockModel.find().sort({ page: 1, order: 1 });

    if (blocks.length === 0) {
      await ContentBlockModel.insertMany(DEFAULT_CONTENT_BLOCKS);
      blocks = await ContentBlockModel.find().sort({ page: 1, order: 1 });
    } else {
      // Check if any default pages are missing entirely and seed them
      const existingPages = new Set(blocks.map((b) => b.page));
      const missingDefaults = DEFAULT_CONTENT_BLOCKS.filter((b) => !existingPages.has(b.page));
      if (missingDefaults.length > 0) {
        await ContentBlockModel.insertMany(missingDefaults);
        blocks = await ContentBlockModel.find().sort({ page: 1, order: 1 });
      }
    }

    const plainBlocks = await Promise.all(
      blocks.map(async (block) => {
        const obj = block.toObject();
        if (obj.section === 'featured_courses' && Array.isArray(obj.data?.courseIds) && obj.data.courseIds.length > 0) {
          const rawCourses = await CourseModel.find({ _id: { $in: obj.data.courseIds } }).populate('category');
          const courseMap = new Map(rawCourses.map((c) => [c._id.toString(), c]));
          const orderedCourses = obj.data.courseIds
            .map((id: any) => courseMap.get(id.toString()))
            .filter(Boolean);
          obj.data.courses = orderedCourses;
        } else if (obj.section === 'featured_courses') {
          obj.data = obj.data || {};
          obj.data.courses = [];
        }
        return obj;
      })
    );
    return plainBlocks;
  }

  static async createContentBlock(payload: Partial<IContentBlock>): Promise<IContentBlock> {
    const block = new ContentBlockModel(payload);
    return block.save();
  }

  static async updateContentBlock(id: string, payload: Partial<IContentBlock>): Promise<any> {
    const block = await ContentBlockModel.findByIdAndUpdate(id, { $set: payload }, { new: true });
    if (!block) throw new Error('Content block not found.');

    const obj = block.toObject();
    if (obj.section === 'featured_courses' && Array.isArray(obj.data?.courseIds) && obj.data.courseIds.length > 0) {
      const rawCourses = await CourseModel.find({ _id: { $in: obj.data.courseIds } }).populate('category');
      const courseMap = new Map(rawCourses.map((c) => [c._id.toString(), c]));
      const orderedCourses = obj.data.courseIds
        .map((cId: any) => courseMap.get(cId.toString()))
        .filter(Boolean);
      obj.data.courses = orderedCourses;
    }
    return obj;
  }

  static async deleteContentBlock(id: string): Promise<boolean> {
    const res = await ContentBlockModel.findByIdAndDelete(id);
    return !!res;
  }
}
