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
exports.SkillServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const skill_model_1 = require("./skill.model");
const createSkill = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield skill_model_1.Skill.create(payload);
    return result.toObject();
});
const getAllSkill = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const projectQuery = new QueryBuilder_1.default(skill_model_1.Skill.find().sort('order'), query);
    const result = yield projectQuery.modelQuery.lean();
    const meta = yield projectQuery.countTotal();
    return { result, meta };
});
const updateSkillOrder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield skill_model_1.Skill.startSession();
    session.startTransaction();
    try {
        for (const item of payload) {
            yield skill_model_1.Skill.findByIdAndUpdate(item.id, { order: item.order }, { session });
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
const getdeleteSkill = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //   const {email} = token
    //   const user = await User.isUserExist(email)
    //   const author = await Blog.findById(id)
    //   if(!user){
    //     throw new AppError(httpStatus.NOT_FOUND,"The user is not found")
    //   }
    //   if(!(user._id.toString()===author?.author.toString())){
    //     throw new AppError(httpStatus.UNAUTHORIZED,"You can not delete this blog, Because you are not author this blog")
    //   }
    const result = yield skill_model_1.Skill.findByIdAndDelete(id).lean();
    return result;
});
exports.SkillServices = {
    createSkill,
    getAllSkill,
    updateSkillOrder,
    getdeleteSkill
};
