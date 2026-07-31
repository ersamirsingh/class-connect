import { Request, Response } from 'express';
import { CategoryService } from './category.service';

export class CategoryController {
  static async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await CategoryService.getCategories();
      res.status(200).json({ success: true, data: categories });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAllCategoriesAdmin(req: Request, res: Response): Promise<void> {
    try {
      const categories = await CategoryService.getAllCategoriesAdmin();
      res.status(200).json({ success: true, data: categories });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await CategoryService.createCategory(req.body);
      res.status(201).json({ success: true, message: 'Category created.', data: category });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const category = await CategoryService.updateCategory(id, req.body);
      res.status(200).json({ success: true, message: 'Category updated.', data: category });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      await CategoryService.deleteCategory(id);
      res.status(200).json({ success: true, message: 'Category deleted.' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
