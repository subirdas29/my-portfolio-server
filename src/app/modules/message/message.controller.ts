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

  const {id} = req.params
  
  await MessageServices.deleteOwnMessageByUser(id);

  res.status(httpStatus.OK).json({
  success: true,
  message: "Message deleted successfully",
  statusCode: httpStatus.OK
  });
});



const getAllMessageController = catchAsync(async (req, res) => {

  const result = await MessageServices.getAllMessage(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Messages fetched successfully",
    data: result,
  });
});

export const MessageController = {
  createMessageController,

  deleteOwnMessageController,
  getAllMessageController
};
