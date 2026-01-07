import { Request, Response } from 'express';
import { uploadToCloudinary, deleteFromCloudinary } from '../../utils/utility';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const uploadImage = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new Error('No file uploaded');
  }

  const secureUrl = await uploadToCloudinary(req.file.buffer, 'images', 'image');

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Image uploaded successfully',
    data: secureUrl,
  });
});

const uploadRawFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new Error('No file uploaded');
  }

  const resourceType = req.file.mimetype.startsWith('video') ? 'video' : 'raw';
  const secureUrl = await uploadToCloudinary(req.file.buffer, 'others', resourceType);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'File uploaded successfully',
    data: secureUrl,
  });
});

const deleteFile = catchAsync(async (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url) {
    throw new Error('URL is required');
  }

  await deleteFromCloudinary(url);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'File deleted successfully from Cloudinary',
    data: null,
  });
});

export const FileUploadController = {
  uploadImage,
  uploadRawFile,
  deleteFile,
};