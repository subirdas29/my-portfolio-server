"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationServices = exports.pushToAll = exports.removeSSEClient = exports.addSSEClient = exports.sseClients = void 0;
const notification_model_1 = require("./notification.model");
exports.sseClients = new Map();
const addSSEClient = (id, res) => exports.sseClients.set(id, res);
exports.addSSEClient = addSSEClient;
const removeSSEClient = (id) => exports.sseClients.delete(id);
exports.removeSSEClient = removeSSEClient;
const pushToAll = (data) => {
    exports.sseClients.forEach((res) => res.write(`data: ${JSON.stringify(data)}\n\n`));
};
exports.pushToAll = pushToAll;
const createNotification = async (type, message, link) => {
    const result = await notification_model_1.Notification.create({ type, message, link });
    (0, exports.pushToAll)({ type: 'new_notification', notification: result });
    return result.toObject();
};
const getAllNotifications = async () => notification_model_1.Notification.find().sort({ createdAt: -1 }).limit(50).lean();
const markAsRead = async (id) => notification_model_1.Notification.findByIdAndUpdate(id, { $set: { read: true } }, { new: true }).lean();
const markAllAsRead = async () => notification_model_1.Notification.updateMany({}, { $set: { read: true } });
const deleteNotification = async (id) => notification_model_1.Notification.findByIdAndDelete(id).lean();
const getUnreadCount = async () => notification_model_1.Notification.countDocuments({ read: false });
exports.NotificationServices = { createNotification, getAllNotifications, markAsRead, markAllAsRead, deleteNotification, getUnreadCount };
//# sourceMappingURL=notification.service.js.map