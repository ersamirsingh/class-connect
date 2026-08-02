import { CategoryModel, ICategory } from '../../modules/category/category.model';

export interface SeededCategories {
  appliedMath: ICategory;
  mern: ICategory;
  dataScience: ICategory;
  uiUx: ICategory;
  digitalMarketing: ICategory;
}

export async function seedCategories(): Promise<SeededCategories> {
  console.log('🏷️ Seeding Categories...');

  const categoriesData = [
    {
      name: 'Applied Mathematics',
      slug: 'applied-mathematics',
      color: '#5B54E8',
      icon: 'calculator',
      description: 'Master algebra, calculus, and statistics for real-world applications.',
      coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'MERN Stack Development',
      slug: 'mern-stack-development',
      color: '#0EA5E9',
      icon: 'code',
      description: 'Full-stack web development using MongoDB, Express, React, and Node.js.',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'Data Science',
      slug: 'data-science',
      color: '#9333EA',
      icon: 'bar-chart',
      description: 'Data analysis, Python, visualization, and machine learning fundamentals.',
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'UI/UX Design',
      slug: 'ui-ux-design',
      color: '#DB2777',
      icon: 'palette',
      description: 'User interface design, wireframing, Figma prototyping, and design systems.',
      coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=600',
    },
    {
      name: 'Digital Marketing',
      slug: 'digital-marketing',
      color: '#1FAE64',
      icon: 'megaphone',
      description: 'Search engine optimization (SEO), social media marketing, and growth analytics.',
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
    },
  ];

  const resultMap: Record<string, ICategory> = {};

  for (const item of categoriesData) {
    let cat = await CategoryModel.findOne({ name: item.name });
    if (!cat) {
      cat = await CategoryModel.create({
        ...item,
        isActive: true,
      });
      console.log(`  ✓ Created category: ${item.name}`);
    } else {
      console.log(`  ℹ Category already exists: ${item.name}`);
    }
    resultMap[item.slug] = cat;
  }

  return {
    appliedMath: resultMap['applied-mathematics'],
    mern: resultMap['mern-stack-development'],
    dataScience: resultMap['data-science'],
    uiUx: resultMap['ui-ux-design'],
    digitalMarketing: resultMap['digital-marketing'],
  };
}
