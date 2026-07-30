import { UserModel, IUser } from './user.model';

export class UserService {
  static async createUser(payload: Partial<IUser>): Promise<IUser> {
    const user = new UserModel(payload);
    return await user.save();
  }

  static async getUsers(): Promise<IUser[]> {
    return await UserModel.find();
  }

  static async getUserById(id: string): Promise<IUser | null> {
    return await UserModel.findById(id);
  }
}
