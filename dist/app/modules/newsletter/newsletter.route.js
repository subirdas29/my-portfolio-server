"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterRoutes = void 0;
const express_1 = require("express");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const newsletter_model_1 = require("./newsletter.model");
const router = (0, express_1.Router)();
router.post('/subscribe', (0, catchAsync_1.default)(async (req, res) => {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).json({ success: false, message: 'Valid email required' });
        return;
    }
    const existing = await newsletter_model_1.Newsletter.findOne({ email });
    if (existing) {
        res.status(200).json({ success: true, message: 'Already subscribed!' });
        return;
    }
    await newsletter_model_1.Newsletter.create({ email });
    res.status(201).json({ success: true, message: 'Subscribed successfully!' });
}));
router.get('/', (0, catchAsync_1.default)(async (_req, res) => {
    const subscribers = await newsletter_model_1.Newsletter.find({ active: true }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: subscribers });
}));
router.delete('/:id', (0, catchAsync_1.default)(async (req, res) => {
    await newsletter_model_1.Newsletter.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted' });
}));
exports.NewsletterRoutes = router;
//# sourceMappingURL=newsletter.route.js.map