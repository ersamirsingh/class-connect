import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  icon: string; // Lucide icon name or image URL
  color: string; // Hex color code (e.g. #3730E0)
  coverImage?: string; // Cloudinary cover image URL
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    icon: { type: String, default: 'Code' },
    color: { type: String, default: '#3730E0' },
    coverImage: { type: String, default: '' },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CategoryModel = model<ICategory>('Category', categorySchema);
