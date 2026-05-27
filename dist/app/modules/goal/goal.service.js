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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalServices = void 0;
const goal_model_1 = require("./goal.model");
const blog_model_1 = require("../blog/blog.model");
const project_model_1 = require("../project/project.model");

const createGoal = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield goal_model_1.Goal.create(payload);
    return result.toObject();
});

const getAllGoals = () => __awaiter(void 0, void 0, void 0, function* () {
    return goal_model_1.Goal.find({ isActive: true }).sort('-createdAt').lean();
});

const updateGoal = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return goal_model_1.Goal.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
});

const deleteGoal = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return goal_model_1.Goal.findByIdAndDelete(id).lean();
});

const syncGoals = () => __awaiter(void 0, void 0, void 0, function* () {
    const goals = yield goal_model_1.Goal.find({ isActive: true }).lean();

    let Client, Order;
    try { Client = require('../client/client.model').Client; } catch(e) { Client = null; }
    try { Order = require('../order/order.model').Order; } catch(e) { Order = null; }

    const updates = goals.map((goal) => __awaiter(void 0, void 0, void 0, function* () {
        let current = 0;
        if (goal.type === 'blogs') {
            current = yield blog_model_1.Blog.countDocuments();
        } else if (goal.type === 'projects') {
            current = yield project_model_1.Project.countDocuments();
        } else if (goal.type === 'clients' && Client) {
            current = yield Client.countDocuments();
        } else if (goal.type === 'orders' && Order) {
            current = yield Order.countDocuments();
        } else if (goal.type === 'revenue' && Order) {
            const agg = yield Order.aggregate([{ $group: { _id: null, total: { $sum: '$paidAmount' } } }]);
            current = agg[0] ? agg[0].total : 0;
        }
        return goal_model_1.Goal.findByIdAndUpdate(goal._id, { $set: { current } }, { new: true }).lean();
    }));

    return Promise.all(updates);
});

exports.GoalServices = {
    createGoal,
    getAllGoals,
    updateGoal,
    deleteGoal,
    syncGoals,
};
