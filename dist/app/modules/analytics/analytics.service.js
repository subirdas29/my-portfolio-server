"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsServices = void 0;
const analytics_model_1 = require("./analytics.model");
const message_model_1 = require("../message/message.model");

const trackPageView = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield analytics_model_1.PageView.create(payload);
    return result.toObject();
});

const updateSession = (sessionId, duration, scrollDepth) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield analytics_model_1.PageView.findOneAndUpdate(
        { sessionId, event: 'pageview' },
        { $set: { duration, scrollDepth } },
        { new: true }
    ).lean();
    return result;
});

const getAnalyticsStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setUTCHours(0, 0, 0, 0);
    const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalViews, todayViews, uniqueVisitorsTodayArr, realtimeCount, topPages, deviceBreakdown, referrerBreakdown, dailyViews, sessionStats] = yield Promise.all([
        analytics_model_1.PageView.countDocuments(),
        analytics_model_1.PageView.countDocuments({ createdAt: { $gte: todayStart } }),
        analytics_model_1.PageView.distinct('sessionId', { createdAt: { $gte: todayStart } }),
        analytics_model_1.PageView.countDocuments({ createdAt: { $gte: fiveMinAgo } }),
        analytics_model_1.PageView.aggregate([
            { $group: { _id: '$url', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]),
        analytics_model_1.PageView.aggregate([
            { $group: { _id: '$device', count: { $sum: 1 } } },
        ]),
        analytics_model_1.PageView.aggregate([
            { $match: { referrer: { $ne: '' } } },
            { $group: { _id: '$referrer', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]),
        analytics_model_1.PageView.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]),
        analytics_model_1.PageView.aggregate([
            { $group: { _id: null, avgDuration: { $avg: '$duration' }, avgScroll: { $avg: '$scrollDepth' } } },
        ]),
    ]);

    return {
        totalViews,
        todayViews,
        uniqueVisitorsToday: uniqueVisitorsTodayArr.length,
        realtimeCount,
        topPages,
        deviceBreakdown,
        referrerBreakdown,
        dailyViews,
        avgSessionDuration: sessionStats[0] ? sessionStats[0].avgDuration : 0,
        avgScrollDepth: sessionStats[0] ? sessionStats[0].avgScroll : 0,
    };
});

const getConversionFunnel = () => __awaiter(void 0, void 0, void 0, function* () {
    let Client, Order;
    try { Client = require('../client/client.model').Client; } catch(e) { Client = null; }
    try { Order = require('../order/order.model').Order; } catch(e) { Order = null; }

    const contacts = yield message_model_1.Message.countDocuments();
    const clients = Client ? yield Client.countDocuments() : 0;
    const orders = Order ? yield Order.countDocuments() : 0;
    const completedOrders = Order ? yield Order.countDocuments({ status: 'Completed' }) : 0;

    return { contacts, clients, orders, completedOrders };
});

exports.AnalyticsServices = {
    trackPageView,
    updateSession,
    getAnalyticsStats,
    getConversionFunnel,
};
