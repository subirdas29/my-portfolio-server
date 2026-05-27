import { Router } from 'express';
import { NotificationController } from './notification.controller';

const router = Router();

router.get('/stream', NotificationController.streamNotifications);
router.get('/', NotificationController.getAllNotificationsController);
router.patch('/read-all', NotificationController.markAllAsReadController);
router.patch('/:id/read', NotificationController.markAsReadController);
router.delete('/:id', NotificationController.deleteNotificationController);

export const NotificationRoutes = router;
