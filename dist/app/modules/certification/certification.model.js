"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Certification = void 0;
const mongoose_1 = require("mongoose");
const certificationSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: String },
    expiryDate: { type: String },
    credentialUrl: { type: String },
    badgeImage: { type: String },
    certificateFile: { type: String },
    order: { type: Number, default: 0 },
}, { timestamps: true });
certificationSchema.index({ order: 1 });
exports.Certification = (0, mongoose_1.model)('Certification', certificationSchema);
//# sourceMappingURL=certification.model.js.map