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

    const courses = await CourseModel.find(filter).populate('category').sort({ createdAt: -1 });
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

  static async updateLiveStatus(id: string, status: 'scheduled' | 'live' | 'ended', meetingUrl?: string): Promise<ICourse> {
    const course = await CourseModel.findById(id);
    if (!course) throw new Error('Course not found.');
    
    course.liveSchedule = {
      ...course.liveSchedule,
      status,
      ...(meetingUrl !== undefined ? { meetingUrl } : {}),
      ...(status === 'live' ? { startTime: new Date() } : {}),
      ...(status === 'ended' ? { endTime: new Date() } : {}),
    };

    if (status === 'live') {
      course.type = 'live';
    }

    return course.save();
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
