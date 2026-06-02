"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalServices = void 0;
const goal_model_1 = require("./goal.model");
const blog_model_1 = require("../blog/blog.model");
const project_model_1 = require("../project/project.model");
const client_model_1 = require("../client/client.model");
const order_model_1 = require("../order/order.model");
const createGoal = async (payload) => { const r = await goal_model_1.Goal.create(payload); return r.toObject(); };
const getAllGoals = async (query = {}) => {
    const filter = { isActive: true };
    if (query.year)
        filter.year = Number(query.year);
    return goal_model_1.Goal.find(filter).sort('-createdAt').lean();
};
const updateGoal = async (id, payload) => goal_model_1.Goal.findByIdAndUpdate(id, payload, { new: true }).lean();
const deleteGoal = async (id) => goal_model_1.Goal.findByIdAndDelete(id).lean();
const syncGoals = async () => {
    const goals = await goal_model_1.Goal.find({ isActive: true }).lean();
    const [blogCount, projectCount, clientCount, orderCount, revenue] = await Promise.all([
        blog_model_1.Blog.countDocuments(),
        project_model_1.Project.countDocuments(),
        client_model_1.Client.countDocuments(),
        order_model_1.Order.countDocuments(),
        order_model_1.Order.aggregate([{ $group: { _id: null, total: { $sum: '$paidAmount' } } }]).then((r) => { var _a; return ((_a = r[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; }),
    ]);
    return Promise.all(goals.map(async (goal) => {
        var _a;
        let current = (_a = goal.current) !== null && _a !== void 0 ? _a : 0;
        if (goal.type === 'blogs' || goal.type === 'blog_posts')
            current = blogCount;
        else if (goal.type === 'projects')
            current = projectCount;
        else if (goal.type === 'clients')
            current = clientCount;
        else if (goal.type === 'orders')
            current = orderCount;
        else if (goal.type === 'revenue')
            current = revenue;
        return goal_model_1.Goal.findByIdAndUpdate(goal._id, { $set: { current } }, { new: true }).lean();
    }));
};
exports.GoalServices = { createGoal, getAllGoals, updateGoal, deleteGoal, syncGoals };
//# sourceMappingURL=goal.service.js.map