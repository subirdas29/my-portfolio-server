import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProjectServices } from './project.service';
import redisClient from '../../utils/redis';


/**
 * প্রজেক্টের ক্যাশ ক্লিয়ার করার হেল্পার ফাংশন
 */
const clearProjectCache = async (projectId?: string) => {
  if (redisClient.isOpen) {
    // প্রজেক্ট লিস্ট ক্যাশ ডিলিট
    await redisClient.del('/api/projects'); 
    // যদি কোনো স্পেসিফিক প্রজেক্টের আইডি থাকে
    if (projectId) {
      await redisClient.del(`/api/projects/project/${projectId}`);
    }
    console.log('🧹 Project Cache Cleared');
  }
};

const createProjectController = catchAsync(async (req, res) => {
  const result = await ProjectServices.createProject(req.body);
  await clearProjectCache(); // ক্যাশ ক্লিন
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Project is created successfully',
    data: result,
  });
});

const getAllProjectController = catchAsync(async (req, res) => {
  const result = await ProjectServices.getAllProject(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Projects fetched successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleProjectController = catchAsync(async (req, res) => {
  const { projectId } = req.params;
  const result = await ProjectServices.getSingleProject(projectId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project fetched successfully',
    data: result
  });
});

const updateProjectOrderController = catchAsync(async (req, res) => {
  const result = await ProjectServices.updateProjectOrder(req.body);
  
  // রি-অর্ডার করলে পুরো লিস্টের সিরিয়াল বদলে যায়, তাই ক্যাশ ক্লিন মাস্ট
  await clearProjectCache(); 
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project order updated successfully',
    data: result,
  });
});

const updateOwnProjectController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ProjectServices.updateProject(id, req.body);
  
  await clearProjectCache(id); // ক্যাশ ক্লিন

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project updated successfully',
    data: result,
  });
});

const deleteOwnProjectController = catchAsync(async (req, res) => {
  const { id } = req.params;
  await ProjectServices.deleteProject(id);
  
  await clearProjectCache(id); // ক্যাশ ক্লিন

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Project deleted successfully',
    statusCode: httpStatus.OK,
  });
});

export const ProjectController = {
  createProjectController,
  updateOwnProjectController,
  deleteOwnProjectController,
  getAllProjectController,
  getSingleProjectController,
  updateProjectOrderController
};