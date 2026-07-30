import { Request, Response } from 'express';
import { UserService } from './user.service';
import { formatUserResponse } from './user.utils';

export class UserController {
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json({ success: true, data: formatUserResponse(user) });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getUsers();
      res.status(200).json({ success: true, data: users.map(formatUserResponse) });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
