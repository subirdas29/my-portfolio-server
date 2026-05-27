"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const newsletter_service_1 = require("./newsletter.service");
const subscribeController = (0, catchAsync_1.default)(async (req, res) => {
    const result = await newsletter_service_1.NewsletterServices.subscribe(req.body.email);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Subscribed successfully', data: result });
});
const unsubscribeController = (0, catchAsync_1.default)(async (req, res) => {
    const result = await newsletter_service_1.NewsletterServices.unsubscribe(req.body.email);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Unsubscribed successfully', data: result });
});
const getAllSubscribersController = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await newsletter_service_1.NewsletterServices.getAllSubscribers();
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Subscribers fetched', data: result });
});
exports.NewsletterController = { subscribeController, unsubscribeController, getAllSubscribersController };
//# sourceMappingURL=newsletter.controller.js.map