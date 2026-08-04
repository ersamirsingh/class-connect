import { ContentBlockModel } from '../../modules/content/content.model';

export async function seedContentBlocks() {
  console.log('🎨 Seeding Content Blocks (CMS)...');

  const blocks = [
    {
      page: 'home',
      section: 'hero',
      title: 'Master In-Demand Digital & AI Skills',
      subtitle: 'Learn directly from industry practitioners with practical, job-ready certification courses.',
      data: {
        ctaText: 'Explore All Courses',
        ctaLink: '/courses',
        bannerUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200',
      },
      order: 1,
      isActive: true,
    },
    {
      page: 'home',
      section: 'testimonial',
      title: 'Student Review - Md Yusuf',
      subtitle: 'Verified Graduate',
      data: {
        name: 'Md Yusuf',
        role: 'Digital Marketer',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        quote: 'The Google Ads course transformed my freelancing career completely. The campaign setup module is unmatched.',
        rating: 5,
      },
      order: 1,
      isActive: true,
    },
    {
      page: 'home',
      section: 'testimonial',
      title: 'Student Review - Mahi Raj',
      subtitle: 'Verified Graduate',
      data: {
        name: 'Mahi Raj',
        role: 'Growth Specialist',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
        quote: 'Hands-down the best structured LMS platform. Real video lectures with zero fluff and instant response support.',
        rating: 5,
      },
      order: 2,
      isActive: true,
    },
    {
      page: 'home',
      section: 'testimonial',
      title: 'Student Review - Sneha Iyer',
      subtitle: 'Verified Graduate',
      data: {
        name: 'Sneha Iyer',
        role: 'UI Designer',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
        quote: 'Canva Mastery helped me create high-converting social media carousels and client pitch decks in minutes.',
        rating: 5,
      },
      order: 3,
      isActive: true,
    },
    {
      page: 'home',
      section: 'footer',
      title: 'ClassConnect Footer',
      data: {
        copyright: '© 2026 ClassConnect Inc. All rights reserved.',
        links: [
          { text: 'Privacy Policy', url: '/privacy' },
          { text: 'Terms of Service', url: '/terms' },
          { text: 'Contact Support', url: '/support' },
        ],
      },
      order: 1,
      isActive: true,
    },
    {
      page: 'about',
      section: 'about',
      title: 'About ClassConnect',
      subtitle: 'Empowering over 10,000+ learners across India with practical skills.',
      data: {
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200',
        mission: 'To bridge the digital skill gap by providing high-quality, practical, bilingual education.',
      },
      order: 1,
      isActive: true,
    },
  ];

  for (const b of blocks) {
    const existing = await ContentBlockModel.findOne({ page: b.page, section: b.section, title: b.title });
    if (!existing) {
      await ContentBlockModel.create(b);
      console.log(`  └─ Created Content Block: ${b.page}/${b.section} - ${b.title}`);
    } else {
      console.log(`  └─ Content Block already exists: ${b.page}/${b.section} - ${b.title}`);
    }
  }

  console.log('✅ Content Blocks Seeding Complete.\n');
}
