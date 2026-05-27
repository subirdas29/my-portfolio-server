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
exports.OrderServices = void 0;
const order_model_1 = require("./order.model");

const createOrder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.create(payload);
    return result.toObject();
});

const getAllOrders = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {};
    if (query && query.status) filter.status = query.status;
    if (query && query.clientId) filter.clientId = query.clientId;
    const result = yield order_model_1.Order.find(filter).sort('-createdAt').lean();
    return result;
});

const getOrderById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return order_model_1.Order.findById(id).lean();
});

const updateOrder = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return order_model_1.Order.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
});

const updateMilestone = (orderId, milestoneId, done) => __awaiter(void 0, void 0, void 0, function* () {
    return order_model_1.Order.findOneAndUpdate(
        { _id: orderId, 'milestones._id': milestoneId },
        { $set: { 'milestones.$.done': done } },
        { new: true }
    ).lean();
});

const addNote = (orderId, text) => __awaiter(void 0, void 0, void 0, function* () {
    return order_model_1.Order.findByIdAndUpdate(
        orderId,
        { $push: { notes: { text, createdAt: new Date() } } },
        { new: true }
    ).lean();
});

const deleteNote = (orderId, noteId) => __awaiter(void 0, void 0, void 0, function* () {
    return order_model_1.Order.findByIdAndUpdate(
        orderId,
        { $pull: { notes: { _id: noteId } } },
        { new: true }
    ).lean();
});

const deleteOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return order_model_1.Order.findByIdAndDelete(id).lean();
});

const getRevenueByMonth = () => __awaiter(void 0, void 0, void 0, function* () {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const result = yield order_model_1.Order.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                revenue: { $sum: '$paidAmount' },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    return result;
});

exports.OrderServices = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    updateMilestone,
    addNote,
    deleteNote,
    deleteOrder,
    getRevenueByMonth,
};
