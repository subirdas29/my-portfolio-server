import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ProjectServices } from './project.service';
import { CacheUtils } from '../../utils/CacheUtils'; 

const createProjectController = catchAsync(async (req, res) => {
  const result = await ProjectServices.createProject(req.body);

  await CacheUtils.clearCache(['/api/v1/projects*']);

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
  

  await CacheUtils.clearCache(['/api/v1/projects*']);
  
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
  

  await CacheUtils.clearCache([
    '/api/v1/projects*', 
    `*/${id}*`
  ]);

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
  

  await CacheUtils.clearCache([
    '/api/v1/projects*', 
    `*/${id}*`
  ]);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project deleted successfully',
    data: null, 
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