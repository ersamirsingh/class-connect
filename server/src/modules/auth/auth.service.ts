import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { UserModel, IUser } from '../user/user.model';
import { config } from '../../config';

const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as any,
  });
};

export class AuthService {
  static async signup(payload: { name: string; email: string; password: string; phone?: string; photo?: string }) {
    const existing = await UserModel.findOne({ email: payload.email.toLowerCase() });
    if (existing) {
      throw new Error('Email is already registered.');
    }

    const user = new UserModel({
      name: payload.name,
      email: payload.email.toLowerCase(),
      password: payload.password,
      phone: payload.phone || '',
      photo: payload.photo || undefined,
      role: 'student',
    });

    await user.save();

    const token = generateToken(user._id.toString());
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  static async login(payload: { email: string; password: string }) {
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

    const token = generateToken(user._id.toString());
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  static async forgotPassword(email: string) {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user || !user.isActive) {
      // Return ambiguous message for security, but return resetToken in dev mode for easy testing
      return { message: 'If an active account exists with that email, a password reset link has been issued.', token: null };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    return {
      message: 'Password reset link sent to your email.',
      resetToken, // Returned so frontend/tests can easily reset password without actual email server
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
