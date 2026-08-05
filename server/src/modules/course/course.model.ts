import { Schema, model, Document, Types } from 'mongoose';

export interface ILecture {
  _id?: Types.ObjectId;
  title: string;
  duration: string;
  videoUrl: string;
  pdfUrl?: string;
  coverImage?: string;
  isPreview: boolean;
}

export interface ISection {
  _id?: Types.ObjectId;
  title: string;
  order: number;
  lectures: ILecture[];
}

export interface ILiveSchedule {
  startTime?: Date;
  endTime?: Date;
  meetingUrl?: string;
  status?: 'scheduled' | 'live' | 'ended';
}

export interface ICourse extends Document {
  title: string;
  titleI18n?: { en?: string; te?: string };
  slug: string;
  subtitle: string;
  description: string;
  descriptionI18n?: { en?: string; te?: string };
  category: Types.ObjectId;
  type: 'live' | 'recorded' | 'hybrid';
  thumbnail: string;
  coverImage?: string;
  previewVideo?: string;
  price: number;
  discountPrice?: number;
  rating: number;
  ratingCount: number;
  instructor: {
    name: string;
    photo: string;
    title: string;
  };
  maxPreviewViews?: number;
  sections: ISection[];
  liveSchedule?: ILiveSchedule;
  isPublished: boolean;
  isFeatured: boolean;
  isSuggested: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const lectureSchema = new Schema<ILecture>({
  title: { type: String, required: true, trim: true },
  duration: { type: String, default: '10 mins' },
  videoUrl: { type: String, required: true },
  pdfUrl: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  isPreview: { type: Boolean, default: false },
});

const sectionSchema = new Schema<ISection>({
  title: { type: String, required: true, trim: true },
  order: { type: Number, default: 1 },
  lectures: [lectureSchema],
});

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    titleI18n: {
      en: { type: String, default: '' },
      te: { type: String, default: '' },
    },
    slug: { type: String, required: true, unique: true, lowercase: true },
    subtitle: { type: String, default: '' },
    description: { type: String, required: true },
    descriptionI18n: {
      en: { type: String, default: '' },
      te: { type: String, default: '' },
    },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    type: { type: String, enum: ['live', 'recorded', 'hybrid'], default: 'recorded' },
    thumbnail: { type: String, required: true },
    coverImage: { type: String, default: '' },
    previewVideo: { type: String, default: 'https://www.w3schools.com/html/mov_bbb.mp4' },
    maxPreviewViews: { type: Number, default: 3 },
    price: { type: Number, required: true, default: 0 },
    discountPrice: { type: Number, default: 0 },
    rating: { type: Number, default: 4.8 },
    ratingCount: { type: Number, default: 120 },
    instructor: {
      name: { type: String, default: 'ClassConnect Master' },
      photo: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' },
      title: { type: String, default: 'Senior Instructor' },
    },
    sections: [sectionSchema],
    liveSchedule: {
      startTime: { type: Date },
      endTime: { type: Date },
      meetingUrl: { type: String, default: '' },
      status: { type: String, enum: ['scheduled', 'live', 'ended'], default: 'scheduled' },
    },
    isPublished: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: true },
    isSuggested: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CourseModel = model<ICourse>('Course', courseSchema);
