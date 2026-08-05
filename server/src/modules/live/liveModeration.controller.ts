import { Request, Response } from 'express';
import { LiveModerationService } from './liveModeration.service';

export class LiveModerationController {
  static async getChatHistory(req: Request, res: Response): Promise<void> {
    try {
      const liveSessionId = String(req.params.liveSessionId);
      const messages = await LiveModerationService.getChatHistory(liveSessionId);
      res.status(200).json({ success: true, data: messages });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getSessionRoster(req: Request, res: Response): Promise<void> {
    try {
      const liveSessionId = String(req.params.liveSessionId);
      const roster = await LiveModerationService.getSessionRoster(liveSessionId);
      res.status(200).json({ success: true, data: roster });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async suspendStudent(req: Request, res: Response): Promise<void> {
    try {
      const adminId = (req as any).user.id || (req as any).user._id;
      const liveSessionId = String(req.params.liveSessionId);
      const { studentId, type, reason, courseId } = req.body;
      const suspension = await LiveModerationService.suspendStudent(
        liveSessionId,
        studentId,
        type,
        reason,
        adminId,
        courseId
      );
      res.status(200).json({ success: true, message: `Student ${type === 'chat_mute' ? 'muted' : 'suspended'}`, data: suspension });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async restoreStudent(req: Request, res: Response): Promise<void> {
    try {
      const liveSessionId = String(req.params.liveSessionId);
      const { studentId } = req.body;
      const result = await LiveModerationService.restoreStudent(liveSessionId, studentId);
      res.status(200).json({ success: true, message: 'Student status restored.', data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}
