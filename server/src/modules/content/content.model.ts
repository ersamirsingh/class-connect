import { Schema, model, Document } from 'mongoose';

export interface IContentBlock extends Document {
  page: string; // 'home', 'about', 'footer'
  section: string; // 'hero', 'banner', 'testimonial', 'features'
  title: string;
  subtitle?: string;
  data: Record<string, any>; // { imageUrl, ctaText, ctaLink, rating, author, authorRole, items: [] }
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const contentBlockSchema = new Schema<IContentBlock>(
  {
    page: { type: String, required: true, default: 'home', index: true },
    section: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    data: { type: Schema.Types.Mixed, default: {} },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const ContentBlockModel = model<IContentBlock>('ContentBlock', contentBlockSchema);
