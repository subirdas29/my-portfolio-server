import { model, Schema } from 'mongoose';
import { TPageView } from './analytics.interface';

const PageViewSchema = new Schema<TPageView>(
  {
    url: { type: String },
    referrer: { type: String, default: '' },
    device: { type: String, enum: ['mobile', 'tablet', 'desktop'], default: 'desktop' },
    country: { type: String, default: '' },
    ipHash: { type: String },
    sessionId: { type: String },
    duration: { type: Number, default: 0 },
    scrollDepth: { type: Number, default: 0 },
    event: { type: String, enum: ['pageview', 'session_end'], default: 'pageview' },
  },
  { timestamps: true },
);

export const PageView = model<TPageView>('PageView', PageViewSchema);
