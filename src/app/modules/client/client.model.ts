import { model, Schema } from 'mongoose';
import { TClient } from './client.interface';

const clientSchema = new Schema<TClient>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    country: { type: String, trim: true },
    status: {
      type: String,
      enum: ['Lead', 'Active', 'Completed', 'Churned'],
      default: 'Lead',
    },
    source: {
      type: String,
      enum: ['contact_form', 'referral', 'social', 'direct', 'other'],
      default: 'other',
    },
    logo: { type: String },
    notes: { type: String },
    tags: [{ type: String }],
    linkedMessageId: { type: Schema.Types.ObjectId, ref: 'Message' },
  },
  { timestamps: true },
);

clientSchema.index({ email: 1 });
clientSchema.index({ status: 1 });

export const Client = model<TClient>('Client', clientSchema);
