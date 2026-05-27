"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const testimonial_service_1 = require("./testimonial.service");
const createTestimonialController = (0, catchAsync_1.default)(async (req, res) => { const r = await testimonial_service_1.TestimonialServices.createTestimonial(req.body); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.CREATED, success: true, message: 'Testimonial created', data: r }); });
const getAllTestimonialsController = (0, catchAsync_1.default)(async (_req, res) => { const r = await testimonial_service_1.TestimonialServices.getAllTestimonials(); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Testimonials fetched', data: r }); });
const updateTestimonialController = (0, catchAsync_1.default)(async (req, res) => { const r = await testimonial_service_1.TestimonialServices.updateTestimonial(req.params.id, req.body); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Testimonial updated', data: r }); });
const deleteTestimonialController = (0, catchAsync_1.default)(async (req, res) => { await testimonial_service_1.TestimonialServices.deleteTestimonial(req.params.id); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Testimonial deleted', data: null }); });
const toggleFeaturedController = (0, catchAsync_1.default)(async (req, res) => { const r = await testimonial_service_1.TestimonialServices.toggleFeatured(req.params.id); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Featured toggled', data: r }); });
exports.TestimonialController = { createTestimonialController, getAllTestimonialsController, updateTestimonialController, deleteTestimonialController, toggleFeaturedController };
//# sourceMappingURL=testimonial.controller.js.map