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
exports.NotificationServices = exports.pushToAll = exports.removeSSEClient = exports.addSSEClient = exports.sseClients = void 0;
const notification_model_1 = require("./notification.model");

exports.sseClients = new Map();

const addSSEClient = (id, res) => {
    exports.sseClients.set(id, res);
};
exports.addSSEClient = addSSEClient;

const removeSSEClient = (id) => {
    exports.sseClients.delete(id);
};
exports.removeSSEClient = removeSSEClient;

const pushToAll = (data) => {
    exports.sseClients.forEach((res) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
};
exports.pushToAll = pushToAll;

const createNotification = (type, message, link) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_model_1.Notification.create({ type, message, link });
    (0, exports.pushToAll)({ type: 'new_notification', notification: result });
    return result.toObject();
});

const getAllNotifications = () => __awaiter(void 0, void 0, void 0, function* () {
    return notification_model_1.Notification.find().sort({ createdAt: -1 }).limit(50).lean();
});

const markAsRead = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return notification_model_1.Notification.findByIdAndUpdate(id, { $set: { read: true } }, { new: true }).lean();
});

const markAllAsRead = () => __awaiter(void 0, void 0, void 0, function* () {
    return notification_model_1.Notification.updateMany({}, { $set: { read: true } });
});

const deleteNotification = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return notification_model_1.Notification.findByIdAndDelete(id).lean();
});

const getUnreadCount = () => __awaiter(void 0, void 0, void 0, function* () {
    return notification_model_1.Notification.countDocuments({ read: false });
});

exports.NotificationServices = {
    createNotification,
    getAllNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
};
