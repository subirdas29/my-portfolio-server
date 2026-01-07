import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BlogServices } from './blog.service';
import redisClient from '../../utils/redis';
 // Redis ইমপোর্ট নিশ্চিত করুন

/**
 * ক্যাশ ক্লিয়ার করার হেল্পার ফাংশন।
 * এটি কন্ট্রোলার ফাইলের ভেতরেই রাখুন।
 */
const clearBlogCache = async (blogId?: string) => {
  try {
    if (redisClient.isOpen) {
      // ১. সব ব্লগের লিস্ট ক্যাশ ডিলিট (আপনার মেইন এপিআই পাথ অনুযায়ী)
      await redisClient.del('/api/blogs'); 
      
      // ২. যদি নির্দিষ্ট কোনো ব্লগের আইডি থাকে, তবে সেটার সিঙ্গেল ক্যাশ ডিলিট
      if (blogId) {
        await redisClient.del(`/api/blogs/blog/${blogId}`);
      }
      console.log('🧹 Redis Blog Cache Cleared Successfully');
    }
  } catch (error) {
    console.error('⚠️ Redis Cache Clear Error:', error);
  }
};

const createBlogController = catchAsync(async (req, res) => {
  const result = await BlogServices.createBlog(req.body);
  
  // নতুন ব্লগ তৈরি হলে পুরনো লিস্ট ক্যাশ ডিলিট করতে হবে
  await clearBlogCache();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Blog is created successfully',
    data: result,
  });
});

const getSingleBlog = catchAsync(async (req, res) => {
  const { blogId } = req.params;
  const result = await BlogServices.getSingleBlog(blogId);

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
  
  // আপডেট হলে মেইন লিস্ট এবং ওই নির্দিষ্ট ব্লগের ক্যাশ ডিলিট করতে হবে
  await clearBlogCache(id);

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

  // ডিলিট হয়ে গেলে পুরনো ক্যাশ রাখা যাবে না
  await clearBlogCache(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog deleted successfully',
    data: null, // ডিলিট হলে ডাটা পাঠানোর দরকার নেই
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