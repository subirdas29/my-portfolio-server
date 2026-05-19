import { model, Schema } from 'mongoose';
import { TNewsletter } from './newsletter.interface';

const newsletterSchema = new Schema<TNewsletter>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    subscribedAt: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Newsletter = model<TNewsletter>('Newsletter', newsletterSchema);
