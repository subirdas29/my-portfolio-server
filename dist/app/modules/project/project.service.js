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
exports.ProjectServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const project_model_1 = require("./project.model");
const blog_utils_1 = require("../blog/blog.utils");
const createProject = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const baseSlug = (0, blog_utils_1.generateSlug)(payload.title);
    const existingProject = yield project_model_1.Project.findOne({ slug: baseSlug }).lean(); // ✅ lean added
    if (existingProject) {
        payload.slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
    }
    else {
        payload.slug = baseSlug;
    }
    const projectData = Object.assign({}, payload);
    const result = yield project_model_1.Project.create(projectData);
    return result.toObject();
});
const getAllProject = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const projectQuery = new QueryBuilder_1.default(project_model_1.Project.find(), query).search(['title', 'details'])
        .filter()
        .sort('order')
        .paginate()
        .fields();
    const result = yield projectQuery.modelQuery.lean();
    const meta = yield projectQuery.countTotal();
    return {
        result,
        meta
    };
});
const getSingleProject = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield project_model_1.Project.findOne({ slug }).lean();
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Project not found');
    }
    return result;
});
const updateProjectOrder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield project_model_1.Project.startSession();
    session.startTransaction();
    try {
        for (const item of payload) {
            yield project_model_1.Project.findByIdAndUpdate(item.id, { order: item.order }, { session });
        }
        yield session.commitTransaction();
        session.endSession();
        return { success: true, message: "Order updated successfully" };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const updateProject = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    //   const {email} = token
    //   const user = await User.isUserExist(email)
    //   const author = await Blog.findById(id)
    //   if(!user){
    //     throw new AppError(httpStatus.NOT_FOUND,"The user is not found")
    //   }
    //   if(!(user._id.toString()===author?.author.toString())){
    //     throw new AppError(httpStatus.UNAUTHORIZED,"You can not update this blog, Because you are not author this blog")
    //   }
    const result = yield project_model_1.Project.findByIdAndUpdate(id, payload, { new: true }).lean();
    return result;
});
const deleteProject = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //   const {email} = token
    //   const user = await User.isUserExist(email)
    //   const author = await Blog.findById(id)
    //   if(!user){
    //     throw new AppError(httpStatus.NOT_FOUND,"The user is not found")
    //   }
    //   if(!(user._id.toString()===author?.author.toString())){
    //     throw new AppError(httpStatus.UNAUTHORIZED,"You can not delete this blog, Because you are not author this blog")
    //   }
    const result = yield project_model_1.Project.findByIdAndDelete(id).lean();
    return result;
});
exports.ProjectServices = {
    createProject,
    updateProject,
    deleteProject,
    getAllProject,
    getSingleProject,
    updateProjectOrder
};
