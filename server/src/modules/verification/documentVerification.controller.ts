import { Request, Response } from 'express';
import { DocumentVerificationService } from './documentVerification.service';

export class DocumentVerificationController {
  static async submitVerification(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user.id || (req as any).user._id;
      const { panNumber, panImageUrl, aadhaarImageUrl } = req.body;
      const result = await DocumentVerificationService.submitVerification(studentId, {
        panNumber,
        panImageUrl,
        aadhaarImageUrl,
      });
      res.status(200).json({ success: true, message: 'Document submitted for Admin verification.', data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getStudentVerification(req: Request, res: Response): Promise<void> {
    try {
      const studentId = (req as any).user.id || (req as any).user._id;
      const result = await DocumentVerificationService.getStudentVerification(studentId);
      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getAdminQueue(req: Request, res: Response): Promise<void> {
    try {
      const statusFilter = req.query.status as string;
      const queue = await DocumentVerificationService.getAdminVerificationQueue(statusFilter);
      res.status(200).json({ success: true, data: queue });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async reviewVerification(req: Request, res: Response): Promise<void> {
    try {
      const adminId = (req as any).user.id || (req as any).user._id;
      const verificationId = String(req.params.id);
      const { action, reason } = req.body;
      const result = await DocumentVerificationService.reviewVerification(verificationId, action, reason, adminId);
      res.status(200).json({ success: true, message: `Document verification ${action}d successfully.`, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}
