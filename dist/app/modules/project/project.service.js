"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const project_model_1 = require("./project.model");
const blog_utils_1 = require("../blog/blog.utils");
const createProject = async (payload) => {
    const baseSlug = (0, blog_utils_1.generateSlug)(payload.title);
    const existingProject = await project_model_1.Project.findOne({ slug: baseSlug }).lean();
    if (existingProject) {
        payload.slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }
    else {
        payload.slug = baseSlug;
    }
    const projectData = Object.assign({}, payload);
    const result = await project_model_1.Project.create(projectData);
    return result.toObject();
};
const getAllProject = async (query) => {
    const projectQuery = new QueryBuilder_1.default(project_model_1.Project.find(), query)
        .search(['title', 'details'])
        .filter()
        .sort('order')
        .paginate()
        .fields();
    const result = await projectQuery.modelQuery.lean();
    const meta = await projectQuery.countTotal();
    return { result, meta };
};
const getSingleProject = async (slug) => {
    const result = await project_model_1.Project.findOne({ slug }).lean();
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Project not found');
    }
    return result;
};
const updateProjectOrder = async (payload) => {
    const session = await project_model_1.Project.startSession();
    session.startTransaction();
    try {
        for (const item of payload) {
            await project_model_1.Project.findByIdAndUpdate(item.id, { order: item.order }, { session });
        }
        await session.commitTransaction();
        session.endSession();
        return { success: true, message: 'Order updated successfully' };
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
const updateProject = async (id, payload) => {
    const result = await project_model_1.Project.findByIdAndUpdate(id, payload, { new: true }).lean();
    return result;
};
const deleteProject = async (id) => {
    const result = await project_model_1.Project.findByIdAndDelete(id).lean();
    return result;
};
exports.ProjectServices = {
    createProject,
    updateProject,
    deleteProject,
    getAllProject,
    getSingleProject,
    updateProjectOrder,
};
//# sourceMappingURL=project.service.js.map