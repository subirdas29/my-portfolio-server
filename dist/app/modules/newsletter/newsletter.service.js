"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterServices = void 0;
const newsletter_model_1 = require("./newsletter.model");
const subscribe = async (email) => {
    const existing = await newsletter_model_1.Newsletter.findOne({ email }).lean();
    if (existing) {
        if (!existing.active)
            return newsletter_model_1.Newsletter.findOneAndUpdate({ email }, { $set: { active: true } }, { new: true }).lean();
        return existing;
    }
    const result = await newsletter_model_1.Newsletter.create({ email });
    return result.toObject();
};
const unsubscribe = async (email) => newsletter_model_1.Newsletter.findOneAndUpdate({ email }, { $set: { active: false } }, { new: true }).lean();
const getAllSubscribers = async () => newsletter_model_1.Newsletter.find({ active: true }).sort('-subscribedAt').lean();
exports.NewsletterServices = { subscribe, unsubscribe, getAllSubscribers };
//# sourceMappingURL=newsletter.service.js.map