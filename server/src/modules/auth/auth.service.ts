import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { UserModel, IUser } from '../user/user.model';
import { config } from '../../config';

const generateToken = (userId: string, sessionId: string): string => {
  return jwt.sign({ id: userId, sessionId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as any,
  });
};

export class AuthService {
  static async signup(payload: { name: string; email: string; password: string; phone?: string; photo?: string; refCode?: string }, clientIp?: string) {
    const existing = await UserModel.findOne({ email: payload.email.toLowerCase() });
    if (existing) {
      throw new Error('Email is already registered.');
    }

    let referrerUser = null;
    const refCodeToUse = payload.refCode || (payload as any).referralCode;
    if (refCodeToUse) {
      const foundReferrer = await UserModel.findOne({ referralCode: refCodeToUse.trim().toUpperCase() });
      if (foundReferrer) {
        const isSelfReferral =
          foundReferrer.email.toLowerCase() === payload.email.toLowerCase() ||
          (payload.phone && foundReferrer.phone && foundReferrer.phone.trim() === payload.phone.trim());
        if (!isSelfReferral) {
          referrerUser = foundReferrer;
        }
      }
    }

    const sessionId = crypto.randomUUID();

    const user = new UserModel({
      name: payload.name,
      email: payload.email.toLowerCase(),
      password: payload.password,
      phone: payload.phone || '',
      photo: payload.photo || undefined,
      referredBy: referrerUser ? referrerUser._id : undefined,
      role: 'student',
      activeSessionId: sessionId,
      lastLoginIp: clientIp || '127.0.0.1',
    });

    await user.save();

    const token = generateToken(user._id.toString(), sessionId);
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  static async login(payload: { email: string; password: string }, clientIp?: string) {
    const user = await UserModel.findOne({ email: payload.email.toLowerCase() }).select('+password');
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated. Please contact support.');
    }

    const isMatch = await user.comparePassword(payload.password);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    // Generate NEW unique session ID for this login (invalidates older logins from other IPs/devices)
    const newSessionId = crypto.randomUUID();
    user.activeSessionId = newSessionId;
    user.lastLoginIp = clientIp || '127.0.0.1';
    await user.save();

    const token = generateToken(user._id.toString(), newSessionId);
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  static async forgotPassword(email: string) {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user || !user.isActive) {
      return { message: 'If an active account exists with that email, a password reset link has been issued.', token: null };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    return {
      message: 'Password reset link sent to your email.',
      resetToken,
    };
  }

  static async resetPassword(payload: { token: string; newPassword: string }) {
    const resetTokenHash = crypto.createHash('sha256').update(payload.token).digest('hex');

    const user = await UserModel.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new Error('Invalid or expired password reset token.');
    }

    user.password = payload.newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: 'Password reset successfully. You can now log in.' };
  }

  static async updatePassword(userId: string, payload: { currentPassword: string; newPassword: string }) {
    const user = await UserModel.findById(userId).select('+password');
    if (!user) {
      throw new Error('User not found.');
    }

    const isMatch = await user.comparePassword(payload.currentPassword);
    if (!isMatch) {
      throw new Error('Incorrect current password.');
    }

    user.password = payload.newPassword;
    await user.save();

    return { message: 'Password updated successfully.' };
  }

  static async getMe(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive.');
    }
    return user;
  }
}
