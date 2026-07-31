import { Request, Response } from 'express';
import { ReportService } from './report.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class ReportController {
  static async createReport(req: AuthRequest, res: Response): Promise<void> {
    try {
      const studentId = req.user!._id.toString();
      const { category, description, relatedCourseId, imageUrls } = req.body;
      const files = req.files as Express.Multer.File[] | undefined;

      if (!description) {
        res.status(400).json({ success: false, message: 'Problem description is required.' });
        return;
      }

      let parsedImageUrls: string[] = [];
      if (imageUrls) {
        parsedImageUrls = typeof imageUrls === 'string' ? JSON.parse(imageUrls) : imageUrls;
      }

      const report = await ReportService.createReport({
        studentId,
        category: category || 'other',
        description,
        files,
        imageUrls: parsedImageUrls,
        relatedCourseId,
      });

      res.status(201).json({
        success: true,
        message: 'Problem report submitted successfully.',
        data: report,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getMyReports(req: AuthRequest, res: Response): Promise<void> {
    try {
      const studentId = req.user!._id.toString();
      const reports = await ReportService.getStudentReports(studentId);
      res.status(200).json({ success: true, data: reports });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAllReportsAdmin(req: AuthRequest, res: Response): Promise<void> {
    try {
      const status = req.query.status as string | undefined;
      const reports = await ReportService.getAllReportsAdmin(status);
      res.status(200).json({ success: true, data: reports });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const { status, adminNote } = req.body;

      const report = await ReportService.updateReportStatus(id, status, adminNote);
      res.status(200).json({
        success: true,
        message: 'Report status updated.',
        data: report,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
