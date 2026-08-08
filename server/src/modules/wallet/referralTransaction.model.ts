import { Schema, model, Document } from 'mongoose';

export type ReferralCommissionStatus = 'pending' | 'available' | 'cancelled';

export interface IReferralTransaction extends Document {
  referrer: any;
  referredStudent: any;
  order: any;
  commissionAmount: number;
  status: ReferralCommissionStatus;
  availableAt: Date;
  createdAt: Date;
}

const referralTransactionSchema = new Schema<IReferralTransaction>(
  {
    referrer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    referredStudent: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    commissionAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'available', 'cancelled'],
      default: 'pending',
    },
    availableAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days holding period
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ReferralTransactionModel = model<IReferralTransaction>('ReferralTransaction', referralTransactionSchema);
