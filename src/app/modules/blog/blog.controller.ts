import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BlogServices } from './blog.service';
import { CacheUtils } from '../../utils/CacheUtils'; 

const createBlogController = catchAsync(async (req, res) => {
  const result = await BlogServices.createBlog(req.body);


  await CacheUtils.clearCache(['/api/v1/blogs*']);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Blog is created successfully',
    data: result,
  });
});

const getSingleBlog = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const result = await BlogServices.getSingleBlog(slug);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog fetched successfully',
    data: result
  });
});

const updateOwnBlogController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await BlogServices.updateOwnBlogByUser(id, req.body);
  

  const cacheKeys = ['/api/v1/blogs*', `*/${id}*` ];


  if (result && result.slug) {
    cacheKeys.push(`*/${result.slug}*`);
  }

  await CacheUtils.clearCache(cacheKeys);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog updated successfully',
    data: result,
  });
});

const deleteOwnBlogController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const project =await BlogServices.deleteOwnBlogByUser(id);


  const cacheKeys = ['/api/v1/blogs*', `*/${id}*` ];
  
  if (project && 'slug' in project) {
    cacheKeys.push(`*/${project.slug}*`);
  }

  await CacheUtils.clearCache(cacheKeys);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog deleted successfully',
    data: null, 
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
  getSingleBlog
};