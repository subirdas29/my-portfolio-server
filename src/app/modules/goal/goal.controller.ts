import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { GoalServices } from './goal.service';

const createGoalController = catchAsync(async (req, res) => { const r = await GoalServices.createGoal(req.body); sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Goal created', data: r }); });
const getAllGoalsController = catchAsync(async (_req, res) => { const r = await GoalServices.getAllGoals(); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Goals fetched', data: r }); });
const updateGoalController = catchAsync(async (req, res) => { const r = await GoalServices.updateGoal(req.params.id, req.body); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Goal updated', data: r }); });
const deleteGoalController = catchAsync(async (req, res) => { await GoalServices.deleteGoal(req.params.id); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Goal deleted', data: null }); });
const syncGoalsController = catchAsync(async (_req, res) => { const r = await GoalServices.syncGoals(); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Goals synced', data: r }); });

export const GoalController = { createGoalController, getAllGoalsController, updateGoalController, deleteGoalController, syncGoalsController };
