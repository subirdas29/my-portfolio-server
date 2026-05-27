import { PageView } from './analytics.model';
import { Message } from '../message/message.model';

const trackPageView = async (payload: object) => {
  const result = await PageView.create(payload);
  return result.toObject();
};

const updateSession = async (sessionId: string, duration: number, scrollDepth: number) => {
  return PageView.findOneAndUpdate(
    { sessionId, event: 'pageview' },
    { $set: { duration, scrollDepth } },
    { new: true },
  ).lean();
};

const getAnalyticsStats = async () => {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);
  const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [totalViews, todayViews, uniqueVisitorsTodayArr, realtimeCount, topPages, deviceBreakdown, referrerBreakdown, dailyViews, sessionStats] = await Promise.all([
    PageView.countDocuments(),
    PageView.countDocuments({ createdAt: { $gte: todayStart } }),
    PageView.distinct('sessionId', { createdAt: { $gte: todayStart } }),
    PageView.countDocuments({ createdAt: { $gte: fiveMinAgo } }),
    PageView.aggregate([{ $group: { _id: '$url', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
    PageView.aggregate([{ $group: { _id: '$device', count: { $sum: 1 } } }]),
    PageView.aggregate([{ $match: { referrer: { $ne: '' } } }, { $group: { _id: '$referrer', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
    PageView.aggregate([{ $match: { createdAt: { $gte: thirtyDaysAgo } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
    PageView.aggregate([{ $group: { _id: null, avgDuration: { $avg: '$duration' }, avgScroll: { $avg: '$scrollDepth' } } }]),
  ]);

  return {
    totalViews, todayViews,
    uniqueVisitorsToday: uniqueVisitorsTodayArr.length,
    realtimeCount, topPages, deviceBreakdown, referrerBreakdown, dailyViews,
    avgSessionDuration: sessionStats[0]?.avgDuration ?? 0,
    avgScrollDepth: sessionStats[0]?.avgScroll ?? 0,
  };
};

const getConversionFunnel = async () => {
  const contacts = await Message.countDocuments();
  return { contacts };
};

export const AnalyticsServices = { trackPageView, updateSession, getAnalyticsStats, getConversionFunnel };
