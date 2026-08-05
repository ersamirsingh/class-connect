import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { IUser } from '../modules/user/user.model';
import { config } from '../config';

export const createTestToken = async (user: IUser): Promise<string> => {
  const sessionId = user.activeSessionId || crypto.randomUUID();
  user.activeSessionId = sessionId;
  await user.save();
  return jwt.sign(
    { id: user._id.toString(), sessionId },
    config.jwtSecret,
    { expiresIn: '7d' }
  );
};
