import { Request, Response } from 'express';
import { ContentService } from './content.service';

export class ContentController {
  static async getPublicContent(req: Request, res: Response): Promise<void> {
    try {
      const page = (req.query.page as string) || 'home';
      const blocks = await ContentService.getPublicContent(page);
      res.status(200).json({ success: true, data: blocks });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAllContentAdmin(req: Request, res: Response): Promise<void> {
    try {
      const blocks = await ContentService.getAllContentAdmin();
      res.status(200).json({ success: true, data: blocks });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createContentBlock(req: Request, res: Response): Promise<void> {
    try {
      const block = await ContentService.createContentBlock(req.body);
      res.status(201).json({ success: true, message: 'Content block created.', data: block });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async updateContentBlock(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const block = await ContentService.updateContentBlock(id, req.body);
      res.status(200).json({ success: true, message: 'Content block updated.', data: block });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteContentBlock(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await ContentService.deleteContentBlock(id);
      res.status(200).json({ success: true, message: 'Content block deleted.' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
