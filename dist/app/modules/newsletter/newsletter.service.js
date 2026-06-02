"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterServices = void 0;
const newsletter_model_1 = require("./newsletter.model");
const sendEmail_1 = require("../../utils/sendEmail");
const emailTemplates_1 = require("../../utils/emailTemplates");
const subscribe = async (email) => {
    const existing = await newsletter_model_1.Newsletter.findOne({ email }).lean();
    if (existing) {
        if (!existing.active) {
            const updated = await newsletter_model_1.Newsletter.findOneAndUpdate({ email }, { $set: { active: true } }, { new: true }).lean();
            await (0, sendEmail_1.sendEmailTo)({ to: email, subject: 'Welcome back! 👋', html: (0, emailTemplates_1.welcomeEmailTemplate)(email) });
            return updated;
        }
        return existing;
    }
    const result = await newsletter_model_1.Newsletter.create({ email });
    await (0, sendEmail_1.sendEmailTo)({ to: email, subject: "You're subscribed! 🎉", html: (0, emailTemplates_1.welcomeEmailTemplate)(email) });
    return result.toObject();
};
const unsubscribe = async (email) => newsletter_model_1.Newsletter.findOneAndUpdate({ email }, { $set: { active: false } }, { new: true }).lean();
const getAllSubscribers = async () => newsletter_model_1.Newsletter.find({ active: true }).sort('-subscribedAt').lean();
const broadcastNewsletter = async ({ subject, body }) => {
    const subscribers = await newsletter_model_1.Newsletter.find({ active: true }).lean();
    if (!subscribers.length)
        return { sent: 0 };
    const results = await Promise.allSettled(subscribers.map((sub) => (0, sendEmail_1.sendEmailTo)({
        to: sub.email,
        subject,
        html: (0, emailTemplates_1.broadcastEmailTemplate)({ subject, body, email: sub.email }),
    })));
    const sent = results.filter((r) => r.status === 'fulfilled').length;
    return { sent, total: subscribers.length };
};
exports.NewsletterServices = { subscribe, unsubscribe, getAllSubscribers, broadcastNewsletter };
//# sourceMappingURL=newsletter.service.js.map