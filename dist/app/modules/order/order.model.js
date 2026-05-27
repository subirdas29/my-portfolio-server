"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const milestoneSchema = new mongoose_1.Schema({ title: String, dueDate: Date, done: { type: Boolean, default: false } });
const noteSchema = new mongoose_1.Schema({ text: String, createdAt: { type: Date, default: Date.now } });
const orderSchema = new mongoose_1.Schema({
    clientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Client', required: true },
    title: { type: String, required: true },
    description: String,
    status: { type: String, enum: ['Pending', 'In Progress', 'Review', 'Completed', 'Cancelled'], default: 'Pending' },
    budget: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    paidAmount: { type: Number, default: 0 },
    startDate: Date, deadline: Date, completedAt: Date,
    milestones: [milestoneSchema],
    notes: [noteSchema],
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project' },
    invoiceUrl: String, contractUrl: String,
}, { timestamps: true });
exports.Order = (0, mongoose_1.model)('Order', orderSchema);
//# sourceMappingURL=order.model.js.map