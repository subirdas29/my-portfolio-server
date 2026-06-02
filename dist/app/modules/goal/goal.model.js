"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Goal = void 0;
const mongoose_1 = require("mongoose");
const goalSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['projects', 'blogs', 'blog_posts', 'clients', 'orders', 'revenue', 'custom'], required: true },
    period: { type: String, enum: ['monthly', 'quarterly', 'yearly'], default: 'monthly' },
    target: { type: Number, required: true },
    current: { type: Number, default: 0 },
    unit: { type: String, default: '' },
    year: { type: Number },
    month: { type: Number },
    quarter: { type: Number },
    notes: { type: String },
    completed: { type: Boolean, default: false },
    startDate: Date, endDate: Date,
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.Goal = (0, mongoose_1.model)('Goal', goalSchema);
//# sourceMappingURL=goal.model.js.map