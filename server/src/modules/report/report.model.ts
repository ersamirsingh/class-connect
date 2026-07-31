import { Schema, model, Document, Types } from 'mongoose';

export interface IReport extends Document {
  student: Types.ObjectId;
  category: 'video' | 'payment' | 'login' | 'other';
  description: string;
  images: string[];
  status: 'open' | 'in-progress' | 'resolved';
  relatedCourse?: Types.ObjectId;
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: String, enum: ['video', 'payment', 'login', 'other'], default: 'other', required: true },
    description: { type: String, required: true, trim: true },
    images: [{ type: String }],
    status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open', index: true },
    relatedCourse: { type: Schema.Types.ObjectId, ref: 'Course' },
    adminNote: { type: String, default: '' },
  },
  { timestamps: true }
);

export const ReportModel = model<IReport>('Report', reportSchema);
