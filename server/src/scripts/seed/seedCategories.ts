import { CategoryModel } from '../../modules/category/category.model';

export async function seedCategories() {
  console.log('📁 Seeding Categories...');

  const categories = [
    {
      name: 'Web Development',
      slug: 'web-development',
      color: '#EF4444',
      icon: 'code',
      description: 'Master HTML, CSS, React 19, Node.js, Next.js & modern fullstack development.',
      isActive: true,
    },
    {
      name: 'App Development',
      slug: 'app-development',
      color: '#10B981',
      icon: 'smartphone',
      description: 'Build Android & iOS apps with React Native, Flutter, Swift & mobile APIs.',
      isActive: true,
    },
    {
      name: 'UI/UX Design',
      slug: 'ui-ux-design',
      color: '#8B5CF6',
      icon: 'palette',
      description: 'Figma, Design Systems, Motion Aesthetics & product wireframing.',
      isActive: true,
    },
    {
      name: 'AI & Data Science',
      slug: 'ai-data-science',
      color: '#3B82F6',
      icon: 'sparkles',
      description: 'Python, Machine Learning, OpenAI APIs, LLM Agents & Data Analytics.',
      isActive: true,
    },
    {
      name: 'Digital Marketing',
      slug: 'digital-marketing',
      color: '#F97316',
      icon: 'megaphone',
      description: 'Master SEO, Meta Ads, Google Ads, content funnels & performance marketing.',
      isActive: true,
    },
    {
      name: 'Cyber Security & Cloud',
      slug: 'cyber-security-cloud',
      color: '#14B8A6',
      icon: 'shield',
      description: 'AWS, Azure, Ethical Hacking, Network Security & DevOps infrastructure.',
      isActive: true,
    },
  ];

  for (const cat of categories) {
    await CategoryModel.findOneAndUpdate(
      { slug: cat.slug },
      cat,
      { upsert: true, new: true }
    );
    console.log(`  └─ Synced Category: ${cat.name}`);
  }

  console.log('✅ Categories Seeding Complete.\n');
}
