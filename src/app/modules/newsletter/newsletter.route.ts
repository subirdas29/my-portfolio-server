import { Router, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { Newsletter } from './newsletter.model';

const router: import("express").Router = Router();

router.post(
  '/subscribe',
  catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ success: false, message: 'Valid email required' });
      return;
    }
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      res.status(200).json({ success: true, message: 'Already subscribed!' });
      return;
    }
    await Newsletter.create({ email });
    res.status(201).json({ success: true, message: 'Subscribed successfully!' });
  }),
);

router.get(
  '/',
  catchAsync(async (_req: Request, res: Response) => {
    const subscribers = await Newsletter.find({ active: true }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: subscribers });
  }),
);

router.delete(
  '/:id',
  catchAsync(async (req: Request, res: Response) => {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted' });
  }),
);

export const NewsletterRoutes = router;
