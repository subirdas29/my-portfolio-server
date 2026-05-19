"use strict";
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
exports.BlogController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const blog_service_1 = require("./blog.service");
const CacheUtils_1 = require("../../utils/CacheUtils");
const createBlogController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_service_1.BlogServices.createBlog(req.body);
    yield CacheUtils_1.CacheUtils.clearCache(['/api/v1/blogs*']);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Blog is created successfully',
        data: result,
    });
}));
const getSingleBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const result = yield blog_service_1.BlogServices.getSingleBlog(slug);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Blog fetched successfully',
        data: result,
    });
}));
const updateOwnBlogController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield blog_service_1.BlogServices.updateOwnBlogByUser(id, req.body);
    const cacheKeys = ['/api/v1/blogs*', `*/${id}*`];
    if (result && result.slug) {
        cacheKeys.push(`*/${result.slug}*`);
    }
    yield CacheUtils_1.CacheUtils.clearCache(cacheKeys);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Blog updated successfully',
        data: result,
    });
}));
const deleteOwnBlogController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const project = yield blog_service_1.BlogServices.deleteOwnBlogByUser(id);
    const cacheKeys = ['/api/v1/blogs*', `*/${id}*`];
    if (project && 'slug' in project) {
        cacheKeys.push(`*/${project.slug}*`);
    }
    yield CacheUtils_1.CacheUtils.clearCache(cacheKeys);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Blog deleted successfully',
        data: null,
    });
}));
const getAllBlogController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield blog_service_1.BlogServices.getAllBlog(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Blogs fetched successfully',
        meta: result.meta,
        data: result.result,
    });
}));
exports.BlogController = {
    createBlogController,
    updateOwnBlogController,
    deleteOwnBlogController,
    getAllBlogController,
    getSingleBlog,
};
