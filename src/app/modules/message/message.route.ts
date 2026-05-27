import express from 'express';
import rateLimit, { MemoryStore } from 'express-rate-limit';
import { MessageController } from './message.controller';

const router = express.Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  store: new MemoryStore(),
  message: {
    success: false,
    message: 'You have reached the message limit (50 per hour). Please try again later.',
  },
});

router.post('/', contactLimiter, MessageController.createMessageController);
router.get('/', MessageController.getAllMessageController);
router.patch('/bulk/status', MessageController.bulkUpdateStatusController);
router.delete('/bulk/delete', MessageController.bulkDeleteController);
router.patch('/:id/status', MessageController.updateMessageStatusController);
router.patch('/:id/priority', MessageController.togglePriorityController);
router.patch('/:id/spam', MessageController.toggleSpamController);
router.post('/:id/reply', MessageController.replyToMessageController);
router.delete('/:id', MessageController.deleteOwnMessageController);

export const MessageRoutes = router;
