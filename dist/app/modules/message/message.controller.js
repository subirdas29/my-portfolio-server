"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const message_service_1 = require("./message.service");
const createMessageController = (0, catchAsync_1.default)(async (req, res) => {
    const result = await message_service_1.MessageServices.createMessage(req.body);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.CREATED, success: true, message: 'Message is created successfully', data: result });
});
const deleteOwnMessageController = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    await message_service_1.MessageServices.deleteOwnMessageByUser(id);
    res.status(http_status_1.default.OK).json({ success: true, message: 'Message deleted successfully', statusCode: http_status_1.default.OK });
});
const updateMessageStatusController = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const result = await message_service_1.MessageServices.updateMessageStatus(id, status);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Message status updated successfully', data: result });
});
const getAllMessageController = (0, catchAsync_1.default)(async (req, res) => {
    const result = await message_service_1.MessageServices.getAllMessage(req.query);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Messages fetched successfully', data: result });
});
const togglePriorityController = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await message_service_1.MessageServices.togglePriority(id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Priority toggled', data: result });
});
const toggleSpamController = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await message_service_1.MessageServices.toggleSpam(id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Spam toggled', data: result });
});
const bulkUpdateStatusController = (0, catchAsync_1.default)(async (req, res) => {
    const { ids, status } = req.body;
    const result = await message_service_1.MessageServices.bulkUpdateStatus(ids, status);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Bulk status updated', data: result });
});
const bulkDeleteController = (0, catchAsync_1.default)(async (req, res) => {
    const { ids } = req.body;
    const result = await message_service_1.MessageServices.bulkDelete(ids);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Bulk delete successful', data: result });
});
const replyToMessageController = (0, catchAsync_1.default)(async (req, res) => {
    const id = req.params.id;
    const { replyHtml } = req.body;
    const result = await message_service_1.MessageServices.replyToMessage(id, replyHtml);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Reply sent successfully', data: result });
});
exports.MessageController = {
    createMessageController,
    updateMessageStatusController,
    deleteOwnMessageController,
    getAllMessageController,
    togglePriorityController,
    toggleSpamController,
    bulkUpdateStatusController,
    bulkDeleteController,
    replyToMessageController,
};
//# sourceMappingURL=message.controller.js.map