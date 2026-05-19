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
exports.ProjectController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const project_service_1 = require("./project.service");
const CacheUtils_1 = require("../../utils/CacheUtils");
const createProjectController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield project_service_1.ProjectServices.createProject(req.body);
    yield CacheUtils_1.CacheUtils.clearCache(['/api/v1/projects*']);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Project is created successfully',
        data: result,
    });
}));
const getAllProjectController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield project_service_1.ProjectServices.getAllProject(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Projects fetched successfully',
        meta: result.meta,
        data: result.result,
    });
}));
const getSingleProjectController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = req.params;
    const result = yield project_service_1.ProjectServices.getSingleProject(slug);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Project fetched successfully',
        data: result
    });
}));
const updateProjectOrderController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield project_service_1.ProjectServices.updateProjectOrder(req.body);
    yield CacheUtils_1.CacheUtils.clearCache(['/api/v1/projects*']);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Project order updated successfully',
        data: result,
    });
}));
const updateOwnProjectController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield project_service_1.ProjectServices.updateProject(id, req.body);
    const cacheKeys = ['/api/v1/projects*', `*/${id}*`];
    if (result && result.slug) {
        cacheKeys.push(`*/${result.slug}*`);
    }
    yield CacheUtils_1.CacheUtils.clearCache(cacheKeys);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Project updated successfully',
        data: result,
    });
}));
const deleteOwnProjectController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const project = yield project_service_1.ProjectServices.deleteProject(id);
    const cacheKeys = ['/api/v1/projects*', `*/${id}*`];
    if (project && 'slug' in project) {
        cacheKeys.push(`*/${project.slug}*`);
    }
    yield CacheUtils_1.CacheUtils.clearCache(cacheKeys);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Project deleted successfully',
        data: null,
    });
}));
exports.ProjectController = {
    createProjectController,
    updateOwnProjectController,
    deleteOwnProjectController,
    getAllProjectController,
    getSingleProjectController,
    updateProjectOrderController
};
