"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const order_service_1 = require("./order.service");
const createOrderController = (0, catchAsync_1.default)(async (req, res) => { const r = await order_service_1.OrderServices.createOrder(req.body); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.CREATED, success: true, message: 'Order created successfully', data: r }); });
const getAllOrdersController = (0, catchAsync_1.default)(async (req, res) => { const r = await order_service_1.OrderServices.getAllOrders(req.query); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Orders fetched successfully', data: r }); });
const getOrderByIdController = (0, catchAsync_1.default)(async (req, res) => { const r = await order_service_1.OrderServices.getOrderById(req.params.id); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Order fetched', data: r }); });
const updateOrderController = (0, catchAsync_1.default)(async (req, res) => { const r = await order_service_1.OrderServices.updateOrder(req.params.id, req.body); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Order updated', data: r }); });
const deleteOrderController = (0, catchAsync_1.default)(async (req, res) => { await order_service_1.OrderServices.deleteOrder(req.params.id); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Order deleted', data: null }); });
const updateMilestoneController = (0, catchAsync_1.default)(async (req, res) => { const r = await order_service_1.OrderServices.updateMilestone(req.params.id, req.params.milestoneId, req.body.done); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Milestone updated', data: r }); });
const addNoteController = (0, catchAsync_1.default)(async (req, res) => { const r = await order_service_1.OrderServices.addNote(req.params.id, req.body.text); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Note added', data: r }); });
const deleteNoteController = (0, catchAsync_1.default)(async (req, res) => { const r = await order_service_1.OrderServices.deleteNote(req.params.id, req.params.noteId); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Note deleted', data: r }); });
const getRevenueByMonthController = (0, catchAsync_1.default)(async (_req, res) => { const r = await order_service_1.OrderServices.getRevenueByMonth(); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Revenue fetched', data: r }); });
exports.OrderController = { createOrderController, getAllOrdersController, getOrderByIdController, updateOrderController, deleteOrderController, updateMilestoneController, addNoteController, deleteNoteController, getRevenueByMonthController };
//# sourceMappingURL=order.controller.js.map