"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Testimonial = void 0;
const mongoose_1 = require("mongoose");
const testimonialSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    role: String, company: String, avatar: String,
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
}, { timestamps: true });
exports.Testimonial = (0, mongoose_1.model)('Testimonial', testimonialSchema);
//# sourceMappingURL=testimonial.model.js.map