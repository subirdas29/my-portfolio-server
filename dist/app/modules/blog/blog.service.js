"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const blog_model_1 = require("./blog.model");
const blog_utils_1 = require("./blog.utils");
const createBlog = async (payload) => {
    const baseSlug = (0, blog_utils_1.generateSlug)(payload.title);
    const existingBlog = await blog_model_1.Blog.findOne({ slug: baseSlug }).lean();
    if (existingBlog) {
        payload.slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }
    else {
        payload.slug = baseSlug;
    }
    const result = await blog_model_1.Blog.create(payload);
    return result.toObject();
};
const getSingleBlog = async (slug) => {
    const result = await blog_model_1.Blog.findOneAndUpdate({ slug }, { $inc: { 'meta.views': 1 } }, { new: true }).lean();
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Blog not found');
    }
    return result;
};
const updateOwnBlogByUser = async (id, payload) => {
    const result = await blog_model_1.Blog.findByIdAndUpdate(id, payload, { new: true }).lean();
    return result;
};
const deleteOwnBlogByUser = async (id) => {
    const result = await blog_model_1.Blog.findByIdAndDelete(id).lean();
    return result;
};
const getAllBlog = async (query) => {
    const blogQuery = new QueryBuilder_1.default(blog_model_1.Blog.find(), query)
        .search(['title', 'content'])
        .filter()
        .sort('-createdAt')
        .paginate()
        .fields();
    const result = await blogQuery.modelQuery.lean();
    const meta = await blogQuery.countTotal();
    return { result, meta };
};
const getBlogAnalytics = async () => {
    const allBlogs = await blog_model_1.Blog.find().lean();
    const published = allBlogs.filter((b) => b.status === 'published');
    const draft = allBlogs.filter((b) => b.status !== 'published');
    const topByViews = [...allBlogs].sort((a, b) => ((b.meta && b.meta.views) || 0) - ((a.meta && a.meta.views) || 0)).slice(0, 5);
    const topByLikes = [...allBlogs].sort((a, b) => ((b.meta && b.meta.likes) || 0) - ((a.meta && a.meta.likes) || 0)).slice(0, 5);
    const recentActivity = [...allBlogs].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);
    const totalViews = allBlogs.reduce((sum, b) => sum + ((b.meta && b.meta.views) || 0), 0);
    const totalLikes = allBlogs.reduce((sum, b) => sum + ((b.meta && b.meta.likes) || 0), 0);
    return {
        topByViews,
        topByLikes,
        publishedVsDraft: [
            {
                status: 'published',
                count: published.length,
                views: published.reduce((s, b) => s + ((b.meta && b.meta.views) || 0), 0),
                likes: published.reduce((s, b) => s + ((b.meta && b.meta.likes) || 0), 0),
            },
            {
                status: 'draft',
                count: draft.length,
                views: draft.reduce((s, b) => s + ((b.meta && b.meta.views) || 0), 0),
                likes: draft.reduce((s, b) => s + ((b.meta && b.meta.likes) || 0), 0),
            },
        ],
        recentActivity,
        summary: {
            total: allBlogs.length,
            published: published.length,
            draft: draft.length,
            totalViews,
            totalLikes,
        },
    };
};
exports.BlogServices = {
    createBlog,
    updateOwnBlogByUser,
    deleteOwnBlogByUser,
    getAllBlog,
    getSingleBlog,
    getBlogAnalytics,
};
//# sourceMappingURL=blog.service.js.map