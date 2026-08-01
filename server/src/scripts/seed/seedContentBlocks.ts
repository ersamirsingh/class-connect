import { ContentBlockModel } from '../../modules/content/content.model';

export async function seedContentBlocks() {
  console.log('🎨 Seeding CMS Content Blocks...');

  const contentBlocksData = [
    {
      page: 'home',
      section: 'hero',
      title: 'Master New Skills with Live & Interactive Courses',
      subtitle: 'Join thousands of students learning Applied Math, MERN Stack, Data Science, and UI/UX Design from industry experts.',
      data: {
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200',
        ctaText: 'Explore Courses',
        ctaLink: '/courses',
        secondaryCtaText: 'How It Works',
        secondaryCtaLink: '/about',
        trustBadge: 'Over 10,000+ Active Students & Certified Graduates',
      },
      order: 1,
      isActive: true,
    },
    {
      page: 'home',
      section: 'testimonial',
      title: 'Priti Singh — Applied Mathematics Graduate',
      subtitle: 'Scored 98% in final exams thanks to step-by-step calculus lectures.',
      data: {
        author: 'Priti Singh',
        authorRole: 'Engineering Student',
        authorPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
        quote: 'ClassConnect transformed my math performance. The interactive calculus and algebra modules made tough topics feel intuitive.',
        rating: 5,
        courseBadge: 'Applied Mathematics',
      },
      order: 1,
      isActive: true,
    },
    {
      page: 'home',
      section: 'testimonial',
      title: 'Priya Verma — MERN Stack Developer',
      subtitle: 'Landed a full-stack developer role within 3 months of completion.',
      data: {
        author: 'Priya Verma',
        authorRole: 'Frontend Developer',
        authorPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
        quote: 'The MERN stack course has incredible depth. Building real MongoDB and Express projects gave me total confidence in interviews.',
        rating: 5,
        courseBadge: 'MERN Stack Development',
      },
      order: 2,
      isActive: true,
    },
    {
      page: 'home',
      section: 'testimonial',
      title: 'Rohan Mehta — Data Science Enthusiast',
      subtitle: 'Mastered Python, Pandas, and Scikit-Learn data modeling.',
      data: {
        author: 'Rohan Mehta',
        authorRole: 'Data Analyst Intern',
        authorPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
        quote: 'Clear video lessons and downloadable resources. The live interactive Q&A sessions are super valuable!',
        rating: 5,
        courseBadge: 'Data Science',
      },
      order: 3,
      isActive: true,
    },
    {
      page: 'home',
      section: 'footer',
      title: 'ClassConnect Learning Platform',
      subtitle: 'Empowering students with accessible, top-tier online education.',
      data: {
        copyright: '© 2026 ClassConnect Inc. All rights reserved.',
        links: [
          { label: 'Explore Courses', url: '/courses' },
          { label: 'Categories', url: '/categories' },
          { label: 'About Us', url: '/about' },
          { label: 'Report a Problem', url: '/report' },
        ],
        socials: {
          twitter: 'https://twitter.com/classconnect',
          github: 'https://github.com/classconnect',
          linkedin: 'https://linkedin.com/company/classconnect',
        },
      },
      order: 1,
      isActive: true,
    },
    {
      page: 'about',
      section: 'main',
      title: 'About ClassConnect',
      subtitle: 'Connecting passionate learners with top-tier education.',
      data: {
        description: 'ClassConnect is a modern e-learning platform featuring live interactive sessions, adaptive video streaming, downloadable resources, and verifiable course certificates.',
        imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
        stats: [
          { value: '10,000+', label: 'Students Enrolled' },
          { value: '500+', label: 'Hours of Video Lessons' },
          { value: '99.4%', label: 'Satisfaction Rate' },
        ],
      },
      order: 1,
      isActive: true,
    },
  ];

  for (const item of contentBlocksData) {
    let block = await ContentBlockModel.findOne({
      page: item.page,
      section: item.section,
      title: item.title,
    });

    if (!block) {
      await ContentBlockModel.create(item);
      console.log(`  ✓ Created CMS block: ${item.page} / ${item.section} ("${item.title}")`);
    } else {
      console.log(`  ℹ CMS block already exists: ${item.page} / ${item.section}`);
    }
  }
}
