import { model, Schema } from 'mongoose';
import { TOrder } from './order.interface';

const milestoneSchema = new Schema({ title: String, dueDate: Date, done: { type: Boolean, default: false } });
const noteSchema = new Schema({ text: String, createdAt: { type: Date, default: Date.now } });

const orderSchema = new Schema<TOrder>({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['Pending', 'In Progress', 'Review', 'Completed', 'Cancelled'], default: 'Pending' },
  budget: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  paidAmount: { type: Number, default: 0 },
  startDate: Date, deadline: Date, completedAt: Date,
  milestones: [milestoneSchema],
  notes: [noteSchema],
  projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
  invoiceUrl: String, contractUrl: String,
}, { timestamps: true });

export const Order = model<TOrder>('Order', orderSchema);
