import { Schema, model, Document } from 'mongoose';

export type WithdrawalStatus = 'pending' | 'approved' | 'rejected' | 'paid';

export interface IWithdrawalRequest extends Document {
  student: any;
  amount: number;
  status: WithdrawalStatus;
  rejectionReason?: string;
  payoutTxId?: string;
  requestedAt: Date;
  processedAt?: Date;
  processedBy?: any;
}

const withdrawalRequestSchema = new Schema<IWithdrawalRequest>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 100 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'paid'],
      default: 'pending',
    },
    rejectionReason: { type: String },
    payoutTxId: { type: String },
    requestedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
    processedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const WithdrawalRequestModel = model<IWithdrawalRequest>('WithdrawalRequest', withdrawalRequestSchema);
