import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MessageServices } from './message.service';

const createMessageController = catchAsync(async (req, res) => {
  const result = await MessageServices.createMessage(req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Message is created successfully', data: result });
});

const deleteOwnMessageController = catchAsync(async (req, res) => {
  const { id } = req.params;
  await MessageServices.deleteOwnMessageByUser(id);
  res.status(httpStatus.OK).json({ success: true, message: 'Message deleted successfully', statusCode: httpStatus.OK });
});

const updateMessageStatusController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await MessageServices.updateMessageStatus(id, status);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Message status updated successfully', data: result });
});

const getAllMessageController = catchAsync(async (req, res) => {
  const result = await MessageServices.getAllMessage(req.query);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Messages fetched successfully', data: result });
});

const togglePriorityController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MessageServices.togglePriority(id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Priority toggled', data: result });
});

const toggleSpamController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MessageServices.toggleSpam(id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Spam toggled', data: result });
});

const bulkUpdateStatusController = catchAsync(async (req, res) => {
  const { ids, status } = req.body;
  const result = await MessageServices.bulkUpdateStatus(ids, status);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Bulk status updated', data: result });
});

const bulkDeleteController = catchAsync(async (req, res) => {
  const { ids } = req.body;
  const result = await MessageServices.bulkDelete(ids);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Bulk delete successful', data: result });
});

const replyToMessageController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { replyHtml } = req.body;
  const result = await MessageServices.replyToMessage(id, replyHtml);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Reply sent successfully', data: result });
});

export const MessageController = {
  createMessageController,
  updateMessageStatusController,
  deleteOwnMessageController,
  getAllMessageController,
  togglePriorityController,
  toggleSpamController,
  bulkUpdateStatusController,
  bulkDeleteController,
  replyToMessageController,
};
