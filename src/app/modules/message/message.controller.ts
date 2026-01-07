import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MessageServices } from './message.service';

const createMessageController = catchAsync(async (req, res) => {
  const result = await MessageServices.createMessage(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Message is created successfully',
    data: result,
  });
});

const deleteOwnMessageController = catchAsync(async (req, res) => {
  const { id } = req.params;

  await MessageServices.deleteOwnMessageByUser(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Message deleted successfully',
    statusCode: httpStatus.OK,
  });
});

const updateMessageStatusController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; 

  const result = await MessageServices.updateMessageStatus(id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Message status updated successfully',
    data: result,
  });
});



const getAllMessageController = catchAsync(async (req, res) => {
  const result = await MessageServices.getAllMessage(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Messages fetched successfully',
    data: result,
  });
});

export const MessageController = {
  createMessageController,
updateMessageStatusController,
  deleteOwnMessageController,
  getAllMessageController,
};
