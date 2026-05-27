"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderServices = void 0;
const order_model_1 = require("./order.model");
const createOrder = async (payload) => { const r = await order_model_1.Order.create(payload); return r.toObject(); };
const getAllOrders = async (query) => order_model_1.Order.find(query).sort('-createdAt').lean();
const getOrderById = async (id) => order_model_1.Order.findById(id).lean();
const updateOrder = async (id, payload) => order_model_1.Order.findByIdAndUpdate(id, payload, { new: true }).lean();
const updateMilestone = async (orderId, milestoneId, done) => order_model_1.Order.findOneAndUpdate({ _id: orderId, 'milestones._id': milestoneId }, { $set: { 'milestones.$.done': done } }, { new: true }).lean();
const addNote = async (orderId, text) => order_model_1.Order.findByIdAndUpdate(orderId, { $push: { notes: { text, createdAt: new Date() } } }, { new: true }).lean();
const deleteNote = async (orderId, noteId) => order_model_1.Order.findByIdAndUpdate(orderId, { $pull: { notes: { _id: noteId } } }, { new: true }).lean();
const deleteOrder = async (id) => order_model_1.Order.findByIdAndDelete(id).lean();
const getRevenueByMonth = async () => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return order_model_1.Order.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, revenue: { $sum: '$paidAmount' }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ]);
};
exports.OrderServices = { createOrder, getAllOrders, getOrderById, updateOrder, updateMilestone, addNote, deleteNote, deleteOrder, getRevenueByMonth };
//# sourceMappingURL=order.service.js.map