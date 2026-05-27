"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalServices = void 0;
const goal_model_1 = require("./goal.model");
const blog_model_1 = require("../blog/blog.model");
const project_model_1 = require("../project/project.model");
const createGoal = async (payload) => { const r = await goal_model_1.Goal.create(payload); return r.toObject(); };
const getAllGoals = async () => goal_model_1.Goal.find({ isActive: true }).sort('-createdAt').lean();
const updateGoal = async (id, payload) => goal_model_1.Goal.findByIdAndUpdate(id, payload, { new: true }).lean();
const deleteGoal = async (id) => goal_model_1.Goal.findByIdAndDelete(id).lean();
const syncGoals = async () => {
    const goals = await goal_model_1.Goal.find({ isActive: true }).lean();
    return Promise.all(goals.map(async (goal) => {
        let current = 0;
        if (goal.type === 'blogs')
            current = await blog_model_1.Blog.countDocuments();
        else if (goal.type === 'projects')
            current = await project_model_1.Project.countDocuments();
        return goal_model_1.Goal.findByIdAndUpdate(goal._id, { $set: { current } }, { new: true }).lean();
    }));
};
exports.GoalServices = { createGoal, getAllGoals, updateGoal, deleteGoal, syncGoals };
//# sourceMappingURL=goal.service.js.map