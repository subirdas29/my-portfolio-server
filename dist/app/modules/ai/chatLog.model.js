"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatLog = void 0;
const mongoose_1 = require("mongoose");
const ChatLogSchema = new mongoose_1.Schema({
    query: { type: String, required: true },
    response: { type: String, required: true },
    score: { type: Number, required: true },
    status: { type: String, enum: ['SUCCESS', 'FAILED'], required: true },
}, { timestamps: true });
exports.ChatLog = (0, mongoose_1.model)('ChatLog', ChatLogSchema);
