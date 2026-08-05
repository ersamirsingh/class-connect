import { Schema, model, Document } from 'mongoose';

export interface IReferralTransaction extends Document {
  referrer: any;
  referredStudent: any;
  order: any;
  commissionAmount: number;
  createdAt: Date;
}

const referralTransactionSchema = new Schema<IReferralTransaction>(
  {
    referrer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    referredStudent: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    commissionAmount: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ReferralTransactionModel = model<IReferralTransaction>('ReferralTransaction', referralTransactionSchema);
