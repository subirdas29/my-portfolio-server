"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientServices = void 0;
const client_model_1 = require("./client.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const mongoose_1 = require("mongoose");
const createClient = async (payload) => {
    const result = await client_model_1.Client.create(payload);
    return result.toObject();
};
const getAllClients = async (query) => {
    const clientQuery = new QueryBuilder_1.default(client_model_1.Client.find(), query)
        .search(['name', 'email', 'company'])
        .filter()
        .sort('-createdAt')
        .paginate()
        .fields();
    const result = await clientQuery.modelQuery.lean();
    const meta = await clientQuery.countTotal();
    return { result, meta };
};
const getClientById = async (id) => client_model_1.Client.findById(id).lean();
const updateClient = async (id, payload) => client_model_1.Client.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
const deleteClient = async (id) => client_model_1.Client.findByIdAndDelete(id).lean();
const getClientWithStats = async (id) => {
    const result = await client_model_1.Client.aggregate([
        { $match: { _id: new mongoose_1.Types.ObjectId(id) } },
        { $lookup: { from: 'orders', localField: '_id', foreignField: 'clientId', as: 'orders' } },
        { $addFields: { totalOrders: { $size: '$orders' }, totalRevenue: { $sum: '$orders.paidAmount' } } },
    ]);
    return result[0] || null;
};
exports.ClientServices = { createClient, getAllClients, getClientById, updateClient, deleteClient, getClientWithStats };
//# sourceMappingURL=client.service.js.map