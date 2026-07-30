import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>('User', userSchema);
