"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");

const milestoneSchema = new mongoose_1.Schema({
    title: { type: String },
    dueDate: { type: Date },
    done: { type: Boolean, default: false },
}, { _id: true });

const noteSchema = new mongoose_1.Schema({
    text: { type: String },
    createdAt: { type: Date, default: Date.now },
}, { _id: true });

const orderSchema = new mongoose_1.Schema({
    clientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Client', required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['Pending', 'In Progress', 'Review', 'Completed', 'Cancelled'], default: 'Pending' },
    budget: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    paidAmount: { type: Number, default: 0 },
    startDate: { type: Date },
    deadline: { type: Date },
    completedAt: { type: Date },
    milestones: [milestoneSchema],
    notes: [noteSchema],
    projectId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Project' },
    invoiceUrl: { type: String },
    contractUrl: { type: String },
}, { timestamps: true });

exports.Order = (0, mongoose_1.model)('Order', orderSchema);
