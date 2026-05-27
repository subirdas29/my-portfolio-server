"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialServices = void 0;
const testimonial_model_1 = require("./testimonial.model");
const createTestimonial = async (payload) => { const r = await testimonial_model_1.Testimonial.create(payload); return r.toObject(); };
const getAllTestimonials = async () => testimonial_model_1.Testimonial.find().sort({ order: 1, createdAt: -1 }).lean();
const updateTestimonial = async (id, payload) => testimonial_model_1.Testimonial.findByIdAndUpdate(id, payload, { new: true }).lean();
const deleteTestimonial = async (id) => testimonial_model_1.Testimonial.findByIdAndDelete(id).lean();
const toggleFeatured = async (id) => {
    const t = await testimonial_model_1.Testimonial.findById(id).lean();
    if (!t)
        throw new Error('Not found');
    return testimonial_model_1.Testimonial.findByIdAndUpdate(id, { $set: { featured: !t.featured } }, { new: true }).lean();
};
exports.TestimonialServices = { createTestimonial, getAllTestimonials, updateTestimonial, deleteTestimonial, toggleFeatured };
//# sourceMappingURL=testimonial.service.js.map