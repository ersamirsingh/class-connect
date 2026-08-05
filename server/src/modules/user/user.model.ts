import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'student' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  phone?: string;
  photo?: string;
  referralCode?: string;
  referredBy?: any;
  activeSessionId?: string;
  lastLoginIp?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  previewViews?: Array<{ course: any; count: number }>;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    isActive: { type: Boolean, default: true },
    phone: { type: String, default: '' },
    photo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: Schema.Types.ObjectId, ref: 'User' },
    previewViews: [
      {
        course: { type: Schema.Types.ObjectId, ref: 'Course' },
        count: { type: Number, default: 0 },
      },
    ],
    activeSessionId: { type: String },
    lastLoginIp: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// Pre-validate hook to generate referralCode if missing
userSchema.pre('validate', function (next) {
  if (!this.referralCode) {
    this.referralCode = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
  next();
});

// Pre-save hook to hash password if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = model<IUser>('User', userSchema);
