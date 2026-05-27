"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const mongoose_1 = require("mongoose");
const settingsSchema = new mongoose_1.Schema({
    ownerName: String, ownerEmail: String, ownerTitle: String, ownerBio: String, ownerAvatar: String,
    githubUsername: { type: String, default: '' },
    socialLinks: { github: String, linkedin: String, twitter: String, facebook: String, instagram: String, youtube: String },
    businessConfig: { currency: { type: String, default: 'USD' }, timezone: { type: String, default: 'Asia/Dhaka' } },
}, { timestamps: true });
exports.Settings = (0, mongoose_1.model)('Settings', settingsSchema);
//# sourceMappingURL=settings.model.js.map