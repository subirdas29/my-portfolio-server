"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const notification_service_1 = require("./notification.service");
const streamNotifications = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    const clientId = Date.now().toString();
    (0, notification_service_1.addSSEClient)(clientId, res);
    notification_service_1.NotificationServices.getUnreadCount().then((count) => res.write(`data: ${JSON.stringify({ type: 'unread_count', count })}\n\n`));
    req.on('close', () => (0, notification_service_1.removeSSEClient)(clientId));
};
const getAllNotificationsController = (0, catchAsync_1.default)(async (_req, res) => { const r = await notification_service_1.NotificationServices.getAllNotifications(); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Notifications fetched', data: r }); });
const markAsReadController = (0, catchAsync_1.default)(async (req, res) => { const r = await notification_service_1.NotificationServices.markAsRead(req.params.id); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Marked as read', data: r }); });
const markAllAsReadController = (0, catchAsync_1.default)(async (_req, res) => { await notification_service_1.NotificationServices.markAllAsRead(); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'All marked as read', data: null }); });
const deleteNotificationController = (0, catchAsync_1.default)(async (req, res) => { await notification_service_1.NotificationServices.deleteNotification(req.params.id); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Notification deleted', data: null }); });
exports.NotificationController = { streamNotifications, getAllNotificationsController, markAsReadController, markAllAsReadController, deleteNotificationController };
//# sourceMappingURL=notification.controller.js.map