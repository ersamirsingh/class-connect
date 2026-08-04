import { CategoryModel } from '../../modules/category/category.model';

export async function seedCategories() {
  console.log('📁 Seeding Categories...');

  const categories = [
    {
      name: 'Digital Marketing & Ads',
      slug: 'digital-marketing-ads',
      color: '#5B54E8',
      icon: 'megaphone',
      description: 'Master SEO, Meta Ads, Google Ads, Blogging, and organic marketing strategies.',
      isActive: true,
    },
    {
      name: 'AI & Prompt Tools',
      slug: 'ai-prompt-tools',
      color: '#0EA5E9',
      icon: 'sparkles',
      description: 'Learn ChatGPT, Prompt Engineering, Website Design with AI, and Faceless AI channels.',
      isActive: true,
    },
    {
      name: 'Freelancing & Earning Online',
      slug: 'freelancing-earning-online',
      color: '#9333EA',
      icon: 'briefcase',
      description: 'Build a high-paying remote career with freelancing, affiliate marketing, and reselling.',
      isActive: true,
    },
    {
      name: 'Design & Video Editing',
      slug: 'design-video-editing',
      color: '#DB2777',
      icon: 'palette',
      description: 'Master graphic design with Canva and viral mobile video editing using Inshot & Capcut.',
      isActive: true,
    },
    {
      name: 'Sales & Career Skills',
      slug: 'sales-career-skills',
      color: '#1FAE64',
      icon: 'trending-up',
      description: 'Excel at B2B sales, communication, lead generation, HR skills, and advanced MS Excel.',
      isActive: true,
    },
  ];

  for (const cat of categories) {
    const existing = await CategoryModel.findOne({ slug: cat.slug });
    if (!existing) {
      await CategoryModel.create(cat);
      console.log(`  └─ Created Category: ${cat.name}`);
    } else {
      console.log(`  └─ Category already exists: ${cat.name}`);
    }
  }

  console.log('✅ Categories Seeding Complete.\n');
}
