import { Request, Response } from 'express';
import { CourseService } from './course.service';

export class CourseController {
  static async getCourses(req: Request, res: Response): Promise<void> {
    try {
      const { category, type, search } = req.query;
      const courses = await CourseService.getCourses({
        category: category as string,
        type: type as string,
        search: search as string,
      });
      res.status(200).json({ success: true, data: courses });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getCourseByIdOrSlug(req: Request, res: Response): Promise<void> {
    try {
      const idOrSlug = req.params.idOrSlug as string;
      const course = await CourseService.getCourseByIdOrSlug(idOrSlug);
      res.status(200).json({ success: true, data: course });
    } catch (error: any) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  static async getSuggestedCourses(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const courses = await CourseService.getSuggestedCourses(limit);
      res.status(200).json({ success: true, data: courses });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async toggleSuggested(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const course = await CourseService.getCourseByIdOrSlug(id);
      const updated = await CourseService.updateCourse(id, { isSuggested: !(course as any).isSuggested });
      res.status(200).json({ success: true, message: `Course ${updated.isSuggested ? 'added to' : 'removed from'} suggestions.`, data: updated });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getAllCoursesAdmin(req: Request, res: Response): Promise<void> {
    try {
      const courses = await CourseService.getAllCoursesAdmin();
      res.status(200).json({ success: true, data: courses });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createCourse(req: Request, res: Response): Promise<void> {
    try {
      const course = await CourseService.createCourse(req.body);
      res.status(201).json({ success: true, message: 'Course created successfully.', data: course });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async updateCourse(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const course = await CourseService.updateCourse(id, req.body);
      res.status(200).json({ success: true, message: 'Course updated successfully.', data: course });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteCourse(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await CourseService.deleteCourse(id);
      res.status(200).json({ success: true, message: 'Course deleted.' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
