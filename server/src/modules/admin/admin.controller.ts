import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class AdminController {
  // Admins
  static async getAdmins(req: AuthRequest, res: Response): Promise<void> {
    try {
      const admins = await AdminService.getAdmins();
      res.status(200).json({ success: true, data: admins });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async createAdmin(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, email, password, phone } = req.body;
      if (!name || !email) {
        res.status(400).json({ success: false, message: 'Name and email are required.' });
        return;
      }

      const admin = await AdminService.createAdmin({ name, email, password, phone });
      res.status(201).json({ success: true, message: 'Admin account created.', data: admin });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async deactivateAdmin(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const admin = await AdminService.deactivateAdmin(id);
      res.status(200).json({ success: true, message: 'Admin account deactivated.', data: admin });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Students
  static async getStudents(req: AuthRequest, res: Response): Promise<void> {
    try {
      const students = await AdminService.getStudents();
      res.status(200).json({ success: true, data: students });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async toggleUserStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const user = await AdminService.toggleUserStatus(id);
      res.status(200).json({ success: true, message: 'User status updated.', data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // Stats
  static async getStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const stats = await AdminService.getDashboardStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Payments Oversight
  static async getPayments(req: AuthRequest, res: Response): Promise<void> {
    try {
      const status = req.query.status as string | undefined;
      const orders = await AdminService.getAllOrders(status);
      res.status(200).json({ success: true, data: orders });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async refundOrder(req: AuthRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const order = await AdminService.refundOrder(id);
      res.status(200).json({ success: true, message: 'Order marked refunded.', data: order });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
