import { model, Schema } from 'mongoose';
import { TGoal } from './goal.interface';

const goalSchema = new Schema<TGoal>({
  title: { type: String, required: true },
  type: { type: String, enum: ['projects', 'blogs', 'clients', 'orders', 'revenue'], required: true },
  period: { type: String, enum: ['monthly', 'quarterly', 'yearly'], default: 'monthly' },
  target: { type: Number, required: true },
  current: { type: Number, default: 0 },
  unit: { type: String, default: '' },
  startDate: Date, endDate: Date,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Goal = model<TGoal>('Goal', goalSchema);
