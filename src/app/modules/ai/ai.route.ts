import express from 'express';
import rateLimit from 'express-rate-limit';
import { MemoryStore } from 'express-rate-limit';
import { AIController } from './ai.controller';

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: new MemoryStore(),
  message: {
    success: false,
    message:
      'Too many chat requests from this IP, please try again after 15 minutes',
  },
});

router.post('/chat', chatLimiter, AIController.chat);

export const AIRoutes = router;
