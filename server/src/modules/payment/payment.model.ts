import { Schema, model, Document, Types } from 'mongoose';

export interface IOrder extends Document {
  student: Types.ObjectId;
  course: Types.ObjectId;
  gateway: 'razorpay' | 'stripe';
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  receiptId: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    gateway: { type: String, enum: ['razorpay', 'stripe'], required: true },
    gatewayOrderId: { type: String, required: true },
    gatewayPaymentId: { type: String, default: '' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending', index: true },
    receiptId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const OrderModel = model<IOrder>('Order', orderSchema);
