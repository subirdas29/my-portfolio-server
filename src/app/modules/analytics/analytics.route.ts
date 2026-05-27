import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AnalyticsController } from './analytics.controller';

const router: import("express").Router = Router();

const trackLimiter = rateLimit({ windowMs: 60 * 1000, max: 100 });

router.post('/track', trackLimiter, AnalyticsController.trackPageViewController);
router.post('/session', AnalyticsController.updateSessionController);
router.get('/stats', AnalyticsController.getAnalyticsStatsController);
router.get('/funnel', AnalyticsController.getConversionFunnelController);

export const AnalyticsRoutes = router;
