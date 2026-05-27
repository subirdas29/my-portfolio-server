import { Order } from './order.model';
import { TOrder } from './order.interface';

const createOrder = async (payload: TOrder) => { const r = await Order.create(payload); return r.toObject(); };
const getAllOrders = async (query: Record<string, unknown>) => Order.find(query as object).sort('-createdAt').lean();
const getOrderById = async (id: string) => Order.findById(id).lean();
const updateOrder = async (id: string, payload: Partial<TOrder>) => Order.findByIdAndUpdate(id, payload, { new: true }).lean();
const updateMilestone = async (orderId: string, milestoneId: string, done: boolean) =>
  Order.findOneAndUpdate({ _id: orderId, 'milestones._id': milestoneId }, { $set: { 'milestones.$.done': done } }, { new: true }).lean();
const addNote = async (orderId: string, text: string) =>
  Order.findByIdAndUpdate(orderId, { $push: { notes: { text, createdAt: new Date() } } }, { new: true }).lean();
const deleteNote = async (orderId: string, noteId: string) =>
  Order.findByIdAndUpdate(orderId, { $pull: { notes: { _id: noteId } } }, { new: true }).lean();
const deleteOrder = async (id: string) => Order.findByIdAndDelete(id).lean();
const getRevenueByMonth = async () => {
  const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, revenue: { $sum: '$paidAmount' }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
};

export const OrderServices = { createOrder, getAllOrders, getOrderById, updateOrder, updateMilestone, addNote, deleteNote, deleteOrder, getRevenueByMonth };
