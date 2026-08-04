import { Schema, model, Document } from 'mongoose';

export interface IBankDetails {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  isVerified: boolean;
  verifiedAt?: Date;
}

export interface IWallet extends Document {
  student: any;
  balance: number;
  bankDetails?: IBankDetails;
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new Schema<IWallet>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    balance: { type: Number, default: 0, min: 0 },
    bankDetails: {
      accountNumber: { type: String, default: '' },
      ifscCode: { type: String, default: '' },
      accountHolderName: { type: String, default: '' },
      isVerified: { type: Boolean, default: false },
      verifiedAt: { type: Date },
    },
  },
  { timestamps: true }
);

export const WalletModel = model<IWallet>('Wallet', walletSchema);
