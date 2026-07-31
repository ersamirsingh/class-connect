import { Schema, model, Document, Types } from 'mongoose';

export interface INotification extends Document {
  user: Types.ObjectId;
  title: string;
  message: string;
  type: 'system' | 'payment' | 'live' | 'report';
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['system', 'payment', 'live', 'report'], default: 'system' },
    link: { type: String },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export const NotificationModel = model<INotification>('Notification', notificationSchema);
