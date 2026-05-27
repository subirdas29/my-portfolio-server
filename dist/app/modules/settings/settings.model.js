"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const mongoose_1 = require("mongoose");

const settingsSchema = new mongoose_1.Schema({
    ownerName: { type: String },
    ownerEmail: { type: String },
    ownerTitle: { type: String },
    ownerBio: { type: String },
    ownerAvatar: { type: String },
    githubUsername: { type: String, default: '' },
    socialLinks: {
        github: { type: String },
        linkedin: { type: String },
        twitter: { type: String },
        facebook: { type: String },
        instagram: { type: String },
        youtube: { type: String },
    },
    businessConfig: {
        currency: { type: String, default: 'USD' },
        timezone: { type: String, default: 'Asia/Dhaka' },
    },
}, { timestamps: true });

exports.Settings = (0, mongoose_1.model)('Settings', settingsSchema);
