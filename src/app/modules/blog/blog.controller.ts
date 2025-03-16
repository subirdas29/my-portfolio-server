import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BlogServices } from './blog.service';

const createBlogController = catchAsync(async (req, res) => {
  const result = await BlogServices.createBlog(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Blog is created successfully',
    data: result,
  });
});

const updateOwnBlogController = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await BlogServices.updateOwnBlogByUser(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog updated successfully',
    data: result,
  });
});

const deleteOwnBlogController = catchAsync(async (req, res) => {
  const { id } = req.params;

  await BlogServices.deleteOwnBlogByUser(id);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Blog deleted successfully',
    statusCode: httpStatus.OK,
  });
});

const getAllBlogController = catchAsync(async (req, res) => {
  const result = await BlogServices.getAllBlog(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blogs fetched successfully',
    data: result,
  });
});

export const BlogController = {
  createBlogController,
  updateOwnBlogController,
  deleteOwnBlogController,
  getAllBlogController,
};
