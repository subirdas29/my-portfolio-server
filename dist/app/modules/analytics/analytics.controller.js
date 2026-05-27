"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const analytics_service_1 = require("./analytics.service");
const trackPageViewController = (0, catchAsync_1.default)(async (req, res) => {
    const result = await analytics_service_1.AnalyticsServices.trackPageView(req.body);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.CREATED, success: true, message: 'Page view tracked', data: result });
});
const updateSessionController = (0, catchAsync_1.default)(async (req, res) => {
    const { sessionId, duration, scrollDepth } = req.body;
    const result = await analytics_service_1.AnalyticsServices.updateSession(sessionId, duration, scrollDepth);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Session updated', data: result });
});
const getAnalyticsStatsController = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await analytics_service_1.AnalyticsServices.getAnalyticsStats();
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Analytics stats fetched', data: result });
});
const getConversionFunnelController = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await analytics_service_1.AnalyticsServices.getConversionFunnel();
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Conversion funnel fetched', data: result });
});
exports.AnalyticsController = {
    trackPageViewController,
    updateSessionController,
    getAnalyticsStatsController,
    getConversionFunnelController,
};
//# sourceMappingURL=analytics.controller.js.map