import express from 'express';
import rateLimit from 'express-rate-limit';
import { MemoryStore } from 'express-rate-limit';
import { MessageController } from './message.controller';

const router = express.Router();


const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // ১ ঘণ্টা
  max: 50, 
  standardHeaders: true,
  legacyHeaders: false,
  store: new MemoryStore(),
  message: {
    success: false,
    message:
      'You have reached the message limit (50 per hour). Please try again later.',
  },
});

router.post('/', contactLimiter, MessageController.createMessageController);

router.patch('/:id/status', MessageController.updateMessageStatusController);

router.delete('/:id', MessageController.deleteOwnMessageController);

router.get('/', MessageController.getAllMessageController);

export const MessageRoutes = router;
