import { UserModel, IUser } from './user.model';
import { uploadToCloudinary } from '../../config/cloudinary';

export class UserService {
  static async getUserById(userId: string): Promise<IUser> {
    const user = await UserModel.findById(userId);
    if (!user || !user.isActive) {
      throw new Error('User profile not found.');
    }
    return user;
  }

  static async updateProfile(
    userId: string,
    payload: { name?: string; phone?: string; email?: string; photo?: string }
  ): Promise<IUser> {
    const user = await UserModel.findById(userId);
    if (!user || !user.isActive) {
      throw new Error('User not found.');
    }

    if (payload.email && payload.email.toLowerCase() !== user.email) {
      const existing = await UserModel.findOne({ email: payload.email.toLowerCase() });
      if (existing) {
        throw new Error('Email is already taken by another account.');
      }
      user.email = payload.email.toLowerCase();
    }

    if (payload.name) user.name = payload.name;
    if (payload.phone !== undefined) user.phone = payload.phone;
    if (payload.photo !== undefined) user.photo = payload.photo;

    await user.save();
    return user;
  }

  static async updatePhoto(userId: string, fileBuffer: Buffer, mimeType: string): Promise<string> {
    const user = await UserModel.findById(userId);
    if (!user || !user.isActive) {
      throw new Error('User not found.');
    }

    const photoUrl = await uploadToCloudinary(fileBuffer, mimeType, 'class-connect/profiles');
    user.photo = photoUrl;
    await user.save();

    return photoUrl;
  }

  static async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(userData);
    return user.save();
  }

  static async getUsers(): Promise<IUser[]> {
    return UserModel.find({ isActive: true });
  }
}
