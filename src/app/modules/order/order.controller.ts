import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrderServices } from './order.service';

const createOrderController = catchAsync(async (req, res) => { const r = await OrderServices.createOrder(req.body); sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Order created successfully', data: r }); });
const getAllOrdersController = catchAsync(async (req, res) => { const r = await OrderServices.getAllOrders(req.query as Record<string, unknown>); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Orders fetched successfully', data: r }); });
const getOrderByIdController = catchAsync(async (req, res) => { const r = await OrderServices.getOrderById(req.params.id as string); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Order fetched', data: r }); });
const updateOrderController = catchAsync(async (req, res) => { const r = await OrderServices.updateOrder(req.params.id as string, req.body); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Order updated', data: r }); });
const deleteOrderController = catchAsync(async (req, res) => { await OrderServices.deleteOrder(req.params.id as string); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Order deleted', data: null }); });
const updateMilestoneController = catchAsync(async (req, res) => { const r = await OrderServices.updateMilestone(req.params.id as string, req.params.milestoneId as string, req.body.done); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Milestone updated', data: r }); });
const addNoteController = catchAsync(async (req, res) => { const r = await OrderServices.addNote(req.params.id as string, req.body.text); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Note added', data: r }); });
const deleteNoteController = catchAsync(async (req, res) => { const r = await OrderServices.deleteNote(req.params.id as string, req.params.noteId as string); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Note deleted', data: r }); });
const getRevenueByMonthController = catchAsync(async (_req, res) => { const r = await OrderServices.getRevenueByMonth(); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Revenue fetched', data: r }); });

export const OrderController = { createOrderController, getAllOrdersController, getOrderByIdController, updateOrderController, deleteOrderController, updateMilestoneController, addNoteController, deleteNoteController, getRevenueByMonthController };
