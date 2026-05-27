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

    notification_service_1.NotificationServices.getUnreadCount().then((count) => {
        res.write(`data: ${JSON.stringify({ type: 'unread_count', count })}\n\n`);
    });

    req.on('close', () => {
        (0, notification_service_1.removeSSEClient)(clientId);
    });
};

const getAllNotificationsController = (0, catchAsync_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_service_1.NotificationServices.getAllNotifications();
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Notifications fetched', data: result });
}));

const markAsReadController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_service_1.NotificationServices.markAsRead(req.params.id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Marked as read', data: result });
}));

const markAllAsReadController = (0, catchAsync_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield notification_service_1.NotificationServices.markAllAsRead();
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'All marked as read', data: null });
}));

const deleteNotificationController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield notification_service_1.NotificationServices.deleteNotification(req.params.id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Notification deleted', data: null });
}));

exports.NotificationController = {
    streamNotifications,
    getAllNotificationsController,
    markAsReadController,
    markAllAsReadController,
    deleteNotificationController,
};
