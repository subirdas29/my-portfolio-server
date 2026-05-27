"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsServices = void 0;
const blog_model_1 = require("../blog/blog.model");
const project_model_1 = require("../project/project.model");
const client_model_1 = require("../client/client.model");
const testimonial_model_1 = require("../testimonial/testimonial.model");
const getStats = async () => {
    const [totalProjects, totalBlogs, totalClients, totalTestimonials] = await Promise.all([
        project_model_1.Project.countDocuments(),
        blog_model_1.Blog.countDocuments({ status: 'published' }),
        client_model_1.Client.countDocuments(),
        testimonial_model_1.Testimonial.countDocuments(),
    ]);
    return { totalProjects, totalBlogs, totalClients, totalTestimonials };
};
exports.StatsServices = { getStats };
//# sourceMappingURL=stats.service.js.map