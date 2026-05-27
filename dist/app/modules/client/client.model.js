"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const mongoose_1 = require("mongoose");
const clientSchema = new mongoose_1.Schema({
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
    linkedMessageId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Message' },
}, { timestamps: true });
clientSchema.index({ email: 1 }, { unique: true });
clientSchema.index({ status: 1 });
exports.Client = (0, mongoose_1.model)('Client', clientSchema);
//# sourceMappingURL=client.model.js.map