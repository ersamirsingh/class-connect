import { Schema, model, Document } from 'mongoose';

export interface ILiveChatMessage extends Document {
  liveSessionId: string;
  student: any;
  message: string;
  createdAt: Date;
}

const liveChatMessageSchema = new Schema<ILiveChatMessage>(
  {
    liveSessionId: { type: String, required: true, index: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const LiveChatMessageModel = model<ILiveChatMessage>('LiveChatMessage', liveChatMessageSchema);
