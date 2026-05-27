import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { NewsletterServices } from './newsletter.service';

const subscribeController = catchAsync(async (req, res) => {
  const result = await NewsletterServices.subscribe(req.body.email);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Subscribed successfully', data: result });
});

const unsubscribeController = catchAsync(async (req, res) => {
  const result = await NewsletterServices.unsubscribe(req.body.email);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Unsubscribed successfully', data: result });
});

const getAllSubscribersController = catchAsync(async (_req, res) => {
  const result = await NewsletterServices.getAllSubscribers();
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Subscribers fetched', data: result });
});

export const NewsletterController = { subscribeController, unsubscribeController, getAllSubscribersController };
