import { model, Schema } from 'mongoose';
import { TTestimonial } from './testimonial.interface';

const testimonialSchema = new Schema<TTestimonial>({
  name: { type: String, required: true },
  role: String, company: String, avatar: String,
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const Testimonial = model<TTestimonial>('Testimonial', testimonialSchema);
