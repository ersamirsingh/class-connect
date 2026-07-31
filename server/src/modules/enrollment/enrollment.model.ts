import { Schema, model, Document, Types } from 'mongoose';

export interface IEnrollment extends Document {
  student: Types.ObjectId;
  course: Types.ObjectId;
  order: Types.ObjectId;
  status: 'active' | 'cancelled';
  enrolledAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
    enrolledAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent duplicate active enrollments for same user and course
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export const EnrollmentModel = model<IEnrollment>('Enrollment', enrollmentSchema);
