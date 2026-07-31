import { Schema, model, Document, Types } from 'mongoose';

export interface IProgress extends Document {
  student: Types.ObjectId;
  course: Types.ObjectId;
  completedLectures: string[]; // lecture IDs or titles
  lastWatched?: {
    lectureId: string;
    positionSeconds: number;
  };
  isCompleted: boolean;
  certificateId?: string;
  certificateIssuedAt?: Date;
  updatedAt: Date;
}

const progressSchema = new Schema<IProgress>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    completedLectures: [{ type: String }],
    lastWatched: {
      lectureId: { type: String },
      positionSeconds: { type: Number, default: 0 },
    },
    isCompleted: { type: Boolean, default: false },
    certificateId: { type: String, default: '' },
    certificateIssuedAt: { type: Date },
  },
  { timestamps: true }
);

progressSchema.index({ student: 1, course: 1 }, { unique: true });

export const ProgressModel = model<IProgress>('Progress', progressSchema);
