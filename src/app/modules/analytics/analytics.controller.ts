import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AnalyticsServices } from './analytics.service';

const trackPageViewController = catchAsync(async (req, res) => {
  const result = await AnalyticsServices.trackPageView(req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Page view tracked', data: result });
});

const updateSessionController = catchAsync(async (req, res) => {
  const { sessionId, duration, scrollDepth } = req.body;
  const result = await AnalyticsServices.updateSession(sessionId, duration, scrollDepth);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Session updated', data: result });
});

const getAnalyticsStatsController = catchAsync(async (_req, res) => {
  const result = await AnalyticsServices.getAnalyticsStats();
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Analytics stats fetched', data: result });
});

const getConversionFunnelController = catchAsync(async (_req, res) => {
  const result = await AnalyticsServices.getConversionFunnel();
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Conversion funnel fetched', data: result });
});

export const AnalyticsController = {
  trackPageViewController,
  updateSessionController,
  getAnalyticsStatsController,
  getConversionFunnelController,
};
