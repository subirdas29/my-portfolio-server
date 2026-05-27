"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const skill_model_1 = require("./skill.model");
const createSkill = async (payload) => {
    const result = await skill_model_1.Skill.create(payload);
    return result.toObject();
};
const getAllSkill = async (query) => {
    const projectQuery = new QueryBuilder_1.default(skill_model_1.Skill.find().sort('order'), query);
    const result = await projectQuery.modelQuery.lean();
    const meta = await projectQuery.countTotal();
    return { result, meta };
};
const updateSkillOrder = async (payload) => {
    const session = await skill_model_1.Skill.startSession();
    session.startTransaction();
    try {
        for (const item of payload) {
            await skill_model_1.Skill.findByIdAndUpdate(item.id, { order: item.order }, { session });
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
const getdeleteSkill = async (id) => {
    const result = await skill_model_1.Skill.findByIdAndDelete(id).lean();
    return result;
};
exports.SkillServices = {
    createSkill,
    getAllSkill,
    updateSkillOrder,
    getdeleteSkill,
};
//# sourceMappingURL=skill.service.js.map