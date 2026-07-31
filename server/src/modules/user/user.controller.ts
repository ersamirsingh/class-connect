import { Request, Response } from 'express';
import { UserService } from './user.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class UserController {
  static async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const user = await UserService.getUserById(userId);
      res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { name, phone, email } = req.body;
      const updatedUser = await UserService.updateProfile(userId, { name, phone, email });
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        data: updatedUser,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async uploadPhoto(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      if (!req.file) {
        res.status(400).json({ success: false, message: 'Please attach an image file.' });
        return;
      }

      const photoUrl = await UserService.updatePhoto(userId, req.file.buffer, req.file.mimetype);
      res.status(200).json({
        success: true,
        message: 'Profile photo updated successfully.',
        photo: photoUrl,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getUsers();
      res.status(200).json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
