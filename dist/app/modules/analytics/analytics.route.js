"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRoutes = void 0;
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const analytics_controller_1 = require("./analytics.controller");
const router = (0, express_1.Router)();
const trackLimiter = (0, express_rate_limit_1.default)({ windowMs: 60 * 1000, max: 100 });
router.post('/track', trackLimiter, analytics_controller_1.AnalyticsController.trackPageViewController);
router.post('/session', analytics_controller_1.AnalyticsController.updateSessionController);
router.get('/stats', analytics_controller_1.AnalyticsController.getAnalyticsStatsController);
router.get('/funnel', analytics_controller_1.AnalyticsController.getConversionFunnelController);
exports.AnalyticsRoutes = router;
//# sourceMappingURL=analytics.route.js.map