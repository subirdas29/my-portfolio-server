"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false, default: '' },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Replied', 'No Response', 'Dealing', 'Booked', 'Closed'],
        default: 'Pending',
    },
    priority: { type: Boolean, default: false },
    spam: { type: Boolean, default: false },
    isConverted: { type: Boolean, default: false },
    replies: [{ text: { type: String, required: true }, sentAt: { type: Date, default: Date.now } }],
}, { timestamps: true });
exports.Message = (0, mongoose_1.model)('Message', MessageSchema);
//# sourceMappingURL=message.model.js.map