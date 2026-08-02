import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserModel, IUser } from '../modules/user/user.model';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Unauthorized. No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; sessionId?: string };

    const user = await UserModel.findById(decoded.id);
    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'Unauthorized. User not found or account is deactivated.' });
      return;
    }

    // Single Active Session Enforcement:
    // If user logged in from another IP or device, decoded.sessionId will not match user.activeSessionId
    if (decoded.sessionId && user.activeSessionId && decoded.sessionId !== user.activeSessionId) {
      res.status(401).json({
        success: false,
        sessionTerminated: true,
        message: 'Session expired. Your account was logged into from another device or IP address.',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error: any) {
    res.status(401).json({ success: false, message: 'Unauthorized. Invalid or expired token.' });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Forbidden. Insufficient permissions.' });
      return;
    }
    next();
  };
};
