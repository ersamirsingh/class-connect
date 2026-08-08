import { Schema, model, Document } from 'mongoose';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface IDocumentVerification extends Document {
  student: any;
  aadhaarNumber: string;
  aadhaarImageUrl: string;
  panNumber?: string;
  panImageUrl?: string;
  status: VerificationStatus;
  rejectionReason?: string;
  reviewedBy?: any;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const documentVerificationSchema = new Schema<IDocumentVerification>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    aadhaarNumber: { type: String, required: true, trim: true },
    aadhaarImageUrl: { type: String, required: true },
    panNumber: { type: String, default: '', uppercase: true, trim: true },
    panImageUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    rejectionReason: { type: String, default: '' },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

export const DocumentVerificationModel = model<IDocumentVerification>('DocumentVerification', documentVerificationSchema);
