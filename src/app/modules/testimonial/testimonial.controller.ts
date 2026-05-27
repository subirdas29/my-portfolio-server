import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TestimonialServices } from './testimonial.service';

const createTestimonialController = catchAsync(async (req, res) => { const r = await TestimonialServices.createTestimonial(req.body); sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Testimonial created', data: r }); });
const getAllTestimonialsController = catchAsync(async (_req, res) => { const r = await TestimonialServices.getAllTestimonials(); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Testimonials fetched', data: r }); });
const updateTestimonialController = catchAsync(async (req, res) => { const r = await TestimonialServices.updateTestimonial(req.params.id as string, req.body); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Testimonial updated', data: r }); });
const deleteTestimonialController = catchAsync(async (req, res) => { await TestimonialServices.deleteTestimonial(req.params.id as string); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Testimonial deleted', data: null }); });
const toggleFeaturedController = catchAsync(async (req, res) => { const r = await TestimonialServices.toggleFeatured(req.params.id as string); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Featured toggled', data: r }); });

export const TestimonialController = { createTestimonialController, getAllTestimonialsController, updateTestimonialController, deleteTestimonialController, toggleFeaturedController };
