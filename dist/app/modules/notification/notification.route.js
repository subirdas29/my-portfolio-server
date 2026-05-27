"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRoutes = void 0;
const express_1 = require("express");
const notification_controller_1 = require("./notification.controller");
const router = (0, express_1.Router)();
router.get('/stream', notification_controller_1.NotificationController.streamNotifications);
router.get('/', notification_controller_1.NotificationController.getAllNotificationsController);
router.patch('/read-all', notification_controller_1.NotificationController.markAllAsReadController);
router.patch('/:id/read', notification_controller_1.NotificationController.markAsReadController);
router.delete('/:id', notification_controller_1.NotificationController.deleteNotificationController);
exports.NotificationRoutes = router;
//# sourceMappingURL=notification.route.js.map