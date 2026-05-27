"use strict";
// import { User } from '../User/user.model';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const createBlog = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const baseSlug = (0, blog_utils_1.generateSlug)(payload.title);
    const existingBlog = yield blog_model_1.Blog.findOne({ slug: baseSlug }).lean();
    if (existingBlog) {
        payload.slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }
    else {
        payload.slug = baseSlug;
    }
    const result = yield blog_model_1.Blog.create(payload);
    return result.toObject();
});
const getSingleBlog = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_model_1.Blog.findOneAndUpdate({ slug }, { $inc: { 'meta.views': 1 } }, { new: true }).lean();
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Blog not found');
    }
    return result;
});
const updateOwnBlogByUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    //   const {email} = token
    //   const user = await User.isUserExist(email)
    //   const author = await Blog.findById(id)
    //   if(!user){
    //     throw new AppError(httpStatus.NOT_FOUND,"The user is not found")
    //   }
    //   if(!(user._id.toString()===author?.author.toString())){
    //     throw new AppError(httpStatus.UNAUTHORIZED,"You can not update this blog, Because you are not author this blog")
    //   }
    const result = yield blog_model_1.Blog.findByIdAndUpdate(id, payload, { new: true }).lean();
    return result;
});
const deleteOwnBlogByUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //   const {email} = token
    //   const user = await User.isUserExist(email)
    //   const author = await Blog.findById(id)
    //   if(!user){
    //     throw new AppError(httpStatus.NOT_FOUND,"The user is not found")
    //   }
    //   if(!(user._id.toString()===author?.author.toString())){
    //     throw new AppError(httpStatus.UNAUTHORIZED,"You can not delete this blog, Because you are not author this blog")
    //   }
    const result = yield blog_model_1.Blog.findByIdAndDelete(id).lean();
    return result;
});
const getAllBlog = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const blogQuery = new QueryBuilder_1.default(blog_model_1.Blog.find(), query)
        .search(['title', 'content'])
        .filter()
        .sort('-createdAt')
        .paginate()
        .fields();
    const result = yield blogQuery.modelQuery.lean();
    const meta = yield blogQuery.countTotal();
    return { result, meta };
});
const getBlogAnalytics = () => __awaiter(void 0, void 0, void 0, function* () {
    const allBlogs = yield blog_model_1.Blog.find().lean();
    const published = allBlogs.filter(b => b.status === 'published');
    const draft = allBlogs.filter(b => b.status !== 'published');
    const topByViews = [...allBlogs].sort((a, b) => ((b.meta && b.meta.views) || 0) - ((a.meta && a.meta.views) || 0)).slice(0, 5);
    const topByLikes = [...allBlogs].sort((a, b) => ((b.meta && b.meta.likes) || 0) - ((a.meta && a.meta.likes) || 0)).slice(0, 5);
    const recentActivity = [...allBlogs].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);
    const totalViews = allBlogs.reduce((sum, b) => sum + ((b.meta && b.meta.views) || 0), 0);
    const totalLikes = allBlogs.reduce((sum, b) => sum + ((b.meta && b.meta.likes) || 0), 0);
    return {
        topByViews,
        topByLikes,
        publishedVsDraft: { published: published.length, draft: draft.length },
        recentActivity,
        summary: {
            total: allBlogs.length,
            published: published.length,
            draft: draft.length,
            totalViews,
            totalLikes,
        },
    };
});
exports.BlogServices = {
    createBlog,
    updateOwnBlogByUser,
    deleteOwnBlogByUser,
    getAllBlog,
    getSingleBlog,
    getBlogAnalytics,
};
