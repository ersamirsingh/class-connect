import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    return;
  }

  // Placeholder for token verification logic (e.g. JWT)
  next();
};
