"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsRoutes = void 0;
const express_1 = require("express");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const project_model_1 = require("../project/project.model");
const blog_model_1 = require("../blog/blog.model");
const client_model_1 = require("../client/client.model");
const testimonial_model_1 = require("../testimonial/testimonial.model");
const router = (0, express_1.Router)();
router.get('/', (0, catchAsync_1.default)(async (_req, res) => {
    const [totalProjects, totalBlogs, totalClients, totalTestimonials] = await Promise.all([
        project_model_1.Project.countDocuments(),
        blog_model_1.Blog.countDocuments({ status: 'published' }),
        client_model_1.Client.countDocuments(),
        testimonial_model_1.Testimonial.countDocuments(),
    ]);
    res.status(200).json({
        success: true,
        message: 'Stats fetched successfully',
        data: {
            totalProjects,
            totalBlogs,
            totalClients,
            totalTestimonials,
        },
    });
}));
exports.StatsRoutes = router;
//# sourceMappingURL=stats.route.js.map