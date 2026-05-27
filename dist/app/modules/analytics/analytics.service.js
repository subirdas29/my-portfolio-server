"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsServices = void 0;
const analytics_model_1 = require("./analytics.model");
const message_model_1 = require("../message/message.model");
const trackPageView = async (payload) => {
    const result = await analytics_model_1.PageView.create(payload);
    return result.toObject();
};
const updateSession = async (sessionId, duration, scrollDepth) => {
    return analytics_model_1.PageView.findOneAndUpdate({ sessionId, event: 'pageview' }, { $set: { duration, scrollDepth } }, { new: true }).lean();
};
const getAnalyticsStats = async () => {
    var _a, _b, _c, _d;
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setUTCHours(0, 0, 0, 0);
    const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const [totalViews, todayViews, uniqueVisitorsTodayArr, realtimeCount, topPages, deviceBreakdown, referrerBreakdown, dailyViews, sessionStats] = await Promise.all([
        analytics_model_1.PageView.countDocuments(),
        analytics_model_1.PageView.countDocuments({ createdAt: { $gte: todayStart } }),
        analytics_model_1.PageView.distinct('sessionId', { createdAt: { $gte: todayStart } }),
        analytics_model_1.PageView.countDocuments({ createdAt: { $gte: fiveMinAgo } }),
        analytics_model_1.PageView.aggregate([{ $group: { _id: '$url', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
        analytics_model_1.PageView.aggregate([{ $group: { _id: '$device', count: { $sum: 1 } } }]),
        analytics_model_1.PageView.aggregate([{ $match: { referrer: { $ne: '' } } }, { $group: { _id: '$referrer', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
        analytics_model_1.PageView.aggregate([{ $match: { createdAt: { $gte: thirtyDaysAgo } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
        analytics_model_1.PageView.aggregate([{ $group: { _id: null, avgDuration: { $avg: '$duration' }, avgScroll: { $avg: '$scrollDepth' } } }]),
    ]);
    return {
        totalViews, todayViews,
        uniqueVisitorsToday: uniqueVisitorsTodayArr.length,
        realtimeCount, topPages, deviceBreakdown, referrerBreakdown, dailyViews,
        avgSessionDuration: (_b = (_a = sessionStats[0]) === null || _a === void 0 ? void 0 : _a.avgDuration) !== null && _b !== void 0 ? _b : 0,
        avgScrollDepth: (_d = (_c = sessionStats[0]) === null || _c === void 0 ? void 0 : _c.avgScroll) !== null && _d !== void 0 ? _d : 0,
    };
};
const getConversionFunnel = async () => {
    const contacts = await message_model_1.Message.countDocuments();
    return { contacts };
};
exports.AnalyticsServices = { trackPageView, updateSession, getAnalyticsStats, getConversionFunnel };
//# sourceMappingURL=analytics.service.js.map