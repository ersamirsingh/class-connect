import { Schema, model, Document } from 'mongoose';

export type SuspensionType = 'chat_mute' | 'full';
export type SuspensionStatus = 'active' | 'lifted';

export interface ILiveSuspension extends Document {
  liveSessionId: string;
  course?: any;
  student: any;
  type: SuspensionType;
  status: SuspensionStatus;
  reason: string;
  suspendedBy: any;
  suspendedAt: Date;
  liftedAt?: Date;
}

const liveSuspensionSchema = new Schema<ILiveSuspension>(
  {
    liveSessionId: { type: String, required: true, index: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['chat_mute', 'full'], required: true },
    status: { type: String, enum: ['active', 'lifted'], default: 'active' },
    reason: { type: String, default: '' },
    suspendedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    suspendedAt: { type: Date, default: Date.now },
    liftedAt: { type: Date },
  },
  { timestamps: true }
);

export const LiveSuspensionModel = model<ILiveSuspension>('LiveSuspension', liveSuspensionSchema);
