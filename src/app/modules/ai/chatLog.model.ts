import { Schema, model } from 'mongoose';

export interface IChatLog {
  query: string;
  response: string;
  score: number;
  status: 'SUCCESS' | 'FAILED';
}

const ChatLogSchema = new Schema<IChatLog>(
  {
    query: { type: String, required: true },
    response: { type: String, required: true },
    score: { type: Number, required: true },
    status: { type: String, enum: ['SUCCESS', 'FAILED'], required: true },
  },
  { timestamps: true },
);

export const ChatLog = model<IChatLog>('ChatLog', ChatLogSchema);
