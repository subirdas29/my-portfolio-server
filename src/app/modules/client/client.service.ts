import { Client } from './client.model';
import { TClient } from './client.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { Types } from 'mongoose';
import { Message } from '../message/message.model';
import { Order } from '../order/order.model';

const createClient = async (payload: TClient) => {
  const result = await Client.create(payload);
  if (payload.linkedMessageId) {
    await Message.findByIdAndUpdate(payload.linkedMessageId, { isConverted: true });
  }
  return result.toObject();
};

const getAllClients = async (query: Record<string, unknown>) => {
  const clientQuery = new QueryBuilder(Client.find(), query)
    .search(['name', 'email', 'company'])
    .filter()
    .sort('-createdAt')
    .paginate()
    .fields();
  const result = await clientQuery.modelQuery.lean();
  const meta = await clientQuery.countTotal();
  return { result, meta };
};

const getClientById = async (id: string) => Client.findById(id).lean();

const updateClient = async (id: string, payload: Partial<TClient>) =>
  Client.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();

const deleteClient = async (id: string) => {
  const deleted = await Client.findByIdAndDelete(id).lean() as any;
  if (deleted) {
    await Order.deleteMany({ clientId: new Types.ObjectId(id) });
    if (deleted.linkedMessageId) {
      await Message.findByIdAndUpdate(deleted.linkedMessageId, { isConverted: false });
    } else if (deleted.email) {
      // fallback: no linkedMessageId on old records — reset by email if no other active client exists
      const stillExists = await Client.exists({ email: deleted.email });
      if (!stillExists) {
        await Message.updateMany({ email: deleted.email }, { isConverted: false });
      }
    }
  }
  return deleted;
};

const getClientWithStats = async (id: string) => {
  const result = await Client.aggregate([
    { $match: { _id: new Types.ObjectId(id) } },
    { $lookup: { from: 'orders', localField: '_id', foreignField: 'clientId', as: 'orders' } },
    { $addFields: { totalOrders: { $size: '$orders' }, totalRevenue: { $sum: '$orders.paidAmount' } } },
  ]);
  return result[0] || null;
};

export const ClientServices = { createClient, getAllClients, getClientById, updateClient, deleteClient, getClientWithStats };
