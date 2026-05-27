"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageView = void 0;
const mongoose_1 = require("mongoose");
const PageViewSchema = new mongoose_1.Schema({
    url: { type: String },
    referrer: { type: String, default: '' },
    device: { type: String, enum: ['mobile', 'tablet', 'desktop'], default: 'desktop' },
    country: { type: String, default: '' },
    ipHash: { type: String },
    sessionId: { type: String },
    duration: { type: Number, default: 0 },
    scrollDepth: { type: Number, default: 0 },
    event: { type: String, enum: ['pageview', 'session_end'], default: 'pageview' },
}, { timestamps: true });
exports.PageView = (0, mongoose_1.model)('PageView', PageViewSchema);
//# sourceMappingURL=analytics.model.js.map