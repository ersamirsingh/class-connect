import { Schema, model, Document, Types } from 'mongoose';

export interface IReview extends Document {
  course: Types.ObjectId;
  student: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

reviewSchema.index({ course: 1, student: 1 }, { unique: true });

export const ReviewModel = model<IReview>('Review', reviewSchema);
