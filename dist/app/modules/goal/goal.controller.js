"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const goal_service_1 = require("./goal.service");
const createGoalController = (0, catchAsync_1.default)(async (req, res) => { const r = await goal_service_1.GoalServices.createGoal(req.body); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.CREATED, success: true, message: 'Goal created', data: r }); });
const getAllGoalsController = (0, catchAsync_1.default)(async (_req, res) => { const r = await goal_service_1.GoalServices.getAllGoals(); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Goals fetched', data: r }); });
const updateGoalController = (0, catchAsync_1.default)(async (req, res) => { const r = await goal_service_1.GoalServices.updateGoal(req.params.id, req.body); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Goal updated', data: r }); });
const deleteGoalController = (0, catchAsync_1.default)(async (req, res) => { await goal_service_1.GoalServices.deleteGoal(req.params.id); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Goal deleted', data: null }); });
const syncGoalsController = (0, catchAsync_1.default)(async (_req, res) => { const r = await goal_service_1.GoalServices.syncGoals(); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Goals synced', data: r }); });
exports.GoalController = { createGoalController, getAllGoalsController, updateGoalController, deleteGoalController, syncGoalsController };
//# sourceMappingURL=goal.controller.js.map