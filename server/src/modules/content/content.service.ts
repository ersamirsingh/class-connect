import { ContentBlockModel, IContentBlock } from './content.model';
import { CourseModel } from '../course/course.model';

const DEFAULT_CONTENT_BLOCKS = [
  {
    page: 'home',
    section: 'hero',
    title: 'Master New Skills With Visual Learning',
    subtitle: 'Interactive video lessons, live classes, and expert guidance designed for visual thinkers.',
    data: {
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000',
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
    section: 'testimonial',
    title: 'Loved by Visual Learners Worldwide',
    subtitle: '',
    data: {
      author: 'Aarav Sharma',
      authorRole: 'Full Stack Learner',
      authorPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
      rating: 5,
      comment: 'ClassConnect made learning web development so intuitive! The step-by-step visual cards helped me understand complex concepts instantly.',
    },
    order: 3,
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
    order: 3,
    isActive: true,
  },
];

export class ContentService {
  static async getPublicContent(page = 'home'): Promise<any[]> {
    let blocks = await ContentBlockModel.find({ page, isActive: true }).sort({ order: 1 });
    
    // Seed defaults if database is empty for this page
    if (blocks.length === 0 && page === 'home') {
      await ContentBlockModel.insertMany(DEFAULT_CONTENT_BLOCKS);
      blocks = await ContentBlockModel.find({ page, isActive: true }).sort({ order: 1 });
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
    const blocks = await ContentBlockModel.find().sort({ page: 1, order: 1 });
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

  static async updateContentBlock(id: string, payload: Partial<IContentBlock>): Promise<IContentBlock> {
    const block = await ContentBlockModel.findByIdAndUpdate(id, payload, { new: true });
    if (!block) throw new Error('Content block not found.');
    return block;
  }

  static async deleteContentBlock(id: string): Promise<boolean> {
    const res = await ContentBlockModel.findByIdAndDelete(id);
    return !!res;
  }
}
