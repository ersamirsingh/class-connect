import { CategoryModel, ICategory } from './category.model';

const DEFAULT_CATEGORIES = [
  { name: 'Web Development', slug: 'web-development', icon: 'Code', color: '#3730E0', description: 'HTML, CSS, JavaScript, React, Node.js & Fullstack' },
  { name: 'UI/UX Design', slug: 'ui-ux-design', icon: 'Palette', color: '#FF7A33', description: 'Figma, Visual Systems & Responsive Design' },
  { name: 'Data Science', slug: 'data-science', icon: 'Database', color: '#1FAE64', description: 'Python, Machine Learning & Analytics' },
  { name: 'Mobile Development', slug: 'mobile-development', icon: 'Smartphone', color: '#9333EA', description: 'React Native, Flutter, iOS & Android' },
  { name: 'Business & AI', slug: 'business-ai', icon: 'BarChart3', color: '#0EA5E9', description: 'AI Tools, Automation & Digital Business' },
  { name: 'DevOps & Cloud', slug: 'devops-cloud', icon: 'Cpu', color: '#DB2777', description: 'Docker, Kubernetes, AWS & CI/CD' },
];

export class CategoryService {
  static async getCategories(): Promise<ICategory[]> {
    let categories = await CategoryModel.find({ isActive: true }).sort({ name: 1 });
    if (categories.length === 0) {
      await CategoryModel.insertMany(DEFAULT_CATEGORIES);
      categories = await CategoryModel.find({ isActive: true }).sort({ name: 1 });
    }
    return categories;
  }

  static async getAllCategoriesAdmin(): Promise<ICategory[]> {
    return CategoryModel.find().sort({ createdAt: -1 });
  }

  static async createCategory(payload: Partial<ICategory>): Promise<ICategory> {
    const slug = payload.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'cat';
    const category = new CategoryModel({ ...payload, slug });
    return category.save();
  }

  static async updateCategory(id: string, payload: Partial<ICategory>): Promise<ICategory> {
    if (payload.name) {
      payload.slug = payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    const category = await CategoryModel.findByIdAndUpdate(id, payload, { new: true });
    if (!category) throw new Error('Category not found.');
    return category;
  }

  static async deleteCategory(id: string): Promise<boolean> {
    const res = await CategoryModel.findByIdAndDelete(id);
    return !!res;
  }
}
