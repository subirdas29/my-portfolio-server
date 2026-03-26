import { model, Schema } from 'mongoose';

export interface TChatLog {
  query: string;
  response: string;
  score: number;
  status: 'SUCCESS' | 'FAILED';
  createdAt: Date;
}

const ChatLogSchema = new Schema<TChatLog>(
  {
    query: { type: String, required: true },
    response: { type: String, required: true },
    score: { type: Number, required: true },
    status: { type: String, enum: ['SUCCESS', 'FAILED'], required: true },
  },
  { timestamps: true },
);

export const ChatLog = model<TChatLog>('ChatLog', ChatLogSchema);
