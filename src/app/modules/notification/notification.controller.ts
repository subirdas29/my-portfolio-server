import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NotificationServices, addSSEClient, removeSSEClient } from './notification.service';

const streamNotifications = (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  const clientId = Date.now().toString();
  addSSEClient(clientId, res);
  NotificationServices.getUnreadCount().then((count) => res.write(`data: ${JSON.stringify({ type: 'unread_count', count })}\n\n`));
  req.on('close', () => removeSSEClient(clientId));
};

const getAllNotificationsController = catchAsync(async (_req, res) => { const r = await NotificationServices.getAllNotifications(); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Notifications fetched', data: r }); });
const markAsReadController = catchAsync(async (req, res) => { const r = await NotificationServices.markAsRead(req.params.id); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Marked as read', data: r }); });
const markAllAsReadController = catchAsync(async (_req, res) => { await NotificationServices.markAllAsRead(); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'All marked as read', data: null }); });
const deleteNotificationController = catchAsync(async (req, res) => { await NotificationServices.deleteNotification(req.params.id); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Notification deleted', data: null }); });

export const NotificationController = { streamNotifications, getAllNotificationsController, markAsReadController, markAllAsReadController, deleteNotificationController };
