import { ReportModel, IReport } from './report.model';
import { uploadToCloudinary } from '../../config/cloudinary';

export class ReportService {
  static async createReport(payload: {
    studentId: string;
    category: 'video' | 'payment' | 'login' | 'other';
    description: string;
    files?: Express.Multer.File[];
    imageUrls?: string[];
    relatedCourseId?: string;
  }) {
    const uploadedUrls: string[] = payload.imageUrls || [];

    if (payload.files && payload.files.length > 0) {
      for (const file of payload.files) {
        const url = await uploadToCloudinary(file.buffer, file.mimetype, 'class-connect/reports');
        uploadedUrls.push(url);
      }
    }

    const report = new ReportModel({
      student: payload.studentId,
      category: payload.category,
      description: payload.description,
      images: uploadedUrls,
      relatedCourse: payload.relatedCourseId || undefined,
      status: 'open',
    });

    return report.save();
  }

  static async getStudentReports(studentId: string): Promise<IReport[]> {
    return ReportModel.find({ student: studentId })
      .populate('relatedCourse', 'title thumbnail')
      .sort({ createdAt: -1 });
  }

  static async getAllReportsAdmin(status?: string): Promise<IReport[]> {
    const filter = status && status !== 'all' ? { status } : {};
    return ReportModel.find(filter)
      .populate('student', 'name email photo phone')
      .populate('relatedCourse', 'title thumbnail')
      .sort({ createdAt: -1 });
  }

  static async updateReportStatus(reportId: string, status: 'open' | 'in-progress' | 'resolved', adminNote?: string): Promise<IReport> {
    const report = await ReportModel.findById(reportId);
    if (!report) {
      throw new Error('Report ticket not found.');
    }

    report.status = status;
    if (adminNote !== undefined) {
      report.adminNote = adminNote;
    }

    await report.save();
    return report;
  }
}
