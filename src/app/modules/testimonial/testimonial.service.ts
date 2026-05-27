import { Testimonial } from './testimonial.model';
import { TTestimonial } from './testimonial.interface';

const createTestimonial = async (payload: TTestimonial) => { const r = await Testimonial.create(payload); return r.toObject(); };
const getAllTestimonials = async () => Testimonial.find().sort({ order: 1, createdAt: -1 }).lean();
const updateTestimonial = async (id: string, payload: Partial<TTestimonial>) => Testimonial.findByIdAndUpdate(id, payload, { new: true }).lean();
const deleteTestimonial = async (id: string) => Testimonial.findByIdAndDelete(id).lean();
const toggleFeatured = async (id: string) => {
  const t = await Testimonial.findById(id).lean();
  if (!t) throw new Error('Not found');
  return Testimonial.findByIdAndUpdate(id, { $set: { featured: !t.featured } }, { new: true }).lean();
};

export const TestimonialServices = { createTestimonial, getAllTestimonials, updateTestimonial, deleteTestimonial, toggleFeatured };
