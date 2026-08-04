import { CourseModel, ICourse } from './course.model';
import { CategoryModel } from '../category/category.model';

export class CourseService {
  static async getCourses(query: { category?: string; type?: string; search?: string }): Promise<ICourse[]> {
    const filter: any = { isPublished: true };

    if (query.category) {
      filter.category = query.category;
    }
    if (query.type) {
      filter.type = query.type;
    }
    if (query.search) {
      filter.title = { $regex: query.search, $options: 'i' };
    }

    let courses = await CourseModel.find(filter).populate('category').sort({ createdAt: -1 });

    // Seed default courses if empty
    if (courses.length === 0 && !query.category && !query.search) {
      await CourseService.seedDefaultCourses();
      courses = await CourseModel.find(filter).populate('category').sort({ createdAt: -1 });
    }

    return courses;
  }

  static async getCourseByIdOrSlug(identifier: string): Promise<ICourse> {
    let course;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      course = await CourseModel.findById(identifier).populate('category');
    } else {
      course = await CourseModel.findOne({ slug: identifier }).populate('category');
    }

    if (!course) {
      throw new Error('Course not found.');
    }
    return course;
  }

  static async getSuggestedCourses(limit: number = 6): Promise<ICourse[]> {
    // First try courses explicitly marked as suggested
    let courses = await CourseModel.find({ isPublished: true, isSuggested: true })
      .populate('category')
      .sort({ createdAt: -1 })
      .limit(limit);

    // Fallback: if no suggested courses, return latest published courses
    if (courses.length === 0) {
      courses = await CourseModel.find({ isPublished: true })
        .populate('category')
        .sort({ createdAt: -1 })
        .limit(limit);
    }

    return courses;
  }

  static async getAllCoursesAdmin(): Promise<ICourse[]> {
    return CourseModel.find().populate('category').sort({ createdAt: -1 });
  }

  static async createCourse(payload: Partial<ICourse>): Promise<ICourse> {
    const slug = payload.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `course-${Date.now()}`;
    const course = new CourseModel({ ...payload, slug });
    const saved = await course.save();

    // Trigger notification to all active students
    try {
      const { NotificationService } = await import('../notification/notification.service');
      await NotificationService.notifyAllStudentsOnCourseLaunch(saved);
    } catch (err) {
      console.warn('Could not dispatch course launch notification:', err);
    }

    return saved;
  }

  static async updateCourse(id: string, payload: Partial<ICourse>): Promise<ICourse> {
    if (payload.title) {
      payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    const course = await CourseModel.findByIdAndUpdate(id, payload, { new: true });
    if (!course) throw new Error('Course not found.');
    return course;
  }

  static async deleteCourse(id: string): Promise<boolean> {
    const res = await CourseModel.findByIdAndDelete(id);
    return !!res;
  }

  static async seedDefaultCourses(): Promise<void> {
    const categories = await CategoryModel.find();
    if (categories.length === 0) return;

    const webCat = categories.find((c) => c.slug === 'web-development') || categories[0];
    const designCat = categories.find((c) => c.slug === 'ui-ux-design') || categories[0];

    const sampleCourses = [
      {
        title: 'Full Stack React & Node.js Mastery',
        slug: 'full-stack-react-node-mastery',
        subtitle: 'Build modern visual web apps from scratch with hands-on projects.',
        description: 'Complete visual step-by-step masterclass on React 19, Node.js, Express, MongoDB, and Tailwind CSS.',
        category: webCat._id,
        type: 'recorded',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
        previewVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
        price: 49,
        discountPrice: 29,
        rating: 4.9,
        ratingCount: 340,
        instructor: {
          name: 'Vikram Mehta',
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
          title: 'Senior Software Architect',
        },
        sections: [
          {
            title: '1. Visual Foundations of React',
            order: 1,
            lectures: [
              { title: 'Welcome to Visual Code', duration: '8 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', isPreview: true },
              { title: 'Components & Props Visualized', duration: '14 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', isPreview: false },
            ],
          },
          {
            title: '2. Backend API Architecture',
            order: 2,
            lectures: [
              { title: 'REST Endpoints & Controllers', duration: '18 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', isPreview: false },
            ],
          },
        ],
        isPublished: true,
        isFeatured: true,
      },
      {
        title: 'UI/UX Visual Design System Masterclass',
        slug: 'ui-ux-visual-design-system-masterclass',
        subtitle: 'Design stunning card-heavy visual interfaces and Figma design systems.',
        description: 'Master visual hierarchy, vibrant color schemes, component libraries, and micro-interactions.',
        category: designCat._id,
        type: 'live',
        thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=800',
        previewVideo: 'https://www.w3schools.com/html/mov_bbb.mp4',
        price: 59,
        discountPrice: 39,
        rating: 4.95,
        ratingCount: 215,
        instructor: {
          name: 'Sophia Chen',
          photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
          title: 'Principal Product Designer',
        },
        liveSchedule: {
          startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          endTime: new Date(Date.now() + 26 * 60 * 60 * 1000),
          meetingUrl: 'https://meet.google.com/demo-live-class',
          status: 'scheduled',
        },
        sections: [
          {
            title: '1. Color Palette & Typography Tokens',
            order: 1,
            lectures: [
              { title: 'Choosing EdTech Palettes', duration: '12 mins', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', isPreview: true },
            ],
          },
        ],
        isPublished: true,
        isFeatured: true,
      },
    ];

    await CourseModel.insertMany(sampleCourses);
  }

  static async trackPreviewPlay(courseId: string, user?: any, guestCount: number = 0) {
    const course = await CourseService.getCourseByIdOrSlug(courseId);
    const maxViews = course.maxPreviewViews || 3;

    if (user && user._id) {
      const { UserModel } = await import('../user/user.model');
      const dbUser = await UserModel.findById(user._id);
      if (dbUser) {
        const previewViews = dbUser.previewViews || [];
        const existingView = previewViews.find((v: any) => (v.course?._id || v.course)?.toString() === course._id.toString());
        const currentCount = existingView ? existingView.count : 0;

        if (currentCount >= maxViews) {
          throw new Error('Preview limit reached — Purchase to continue.');
        }

        if (existingView) {
          await UserModel.updateOne(
            { _id: user._id, 'previewViews.course': course._id },
            { $inc: { 'previewViews.$.count': 1 } }
          );
        } else {
          await UserModel.updateOne(
            { _id: user._id },
            { $push: { previewViews: { course: course._id, count: 1 } } }
          );
        }

        const remainingViews = Math.max(0, maxViews - (currentCount + 1));
        return {
          allowed: true,
          remainingViews,
          previewVideoUrl: course.previewVideo,
          maxViews,
        };
      }
    }

    // Guest fallback view counter logic
    const currentGuestCount = guestCount + 1;
    if (currentGuestCount > maxViews) {
      throw new Error('Preview limit reached — Purchase to continue.');
    }

    return {
      allowed: true,
      remainingViews: maxViews - currentGuestCount,
      previewVideoUrl: course.previewVideo,
      maxViews,
      guestCount: currentGuestCount,
    };
  }
}
