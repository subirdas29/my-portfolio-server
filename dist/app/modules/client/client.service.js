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
exports.ClientServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const client_model_1 = require("./client.model");

const createClient = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield client_model_1.Client.create(payload);
    return result.toObject();
});

const getAllClients = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const clientQuery = new QueryBuilder_1.default(client_model_1.Client.find(), query)
        .search(['name', 'email', 'company'])
        .filter()
        .sort('-createdAt')
        .paginate()
        .fields();
    const result = yield clientQuery.modelQuery.lean();
    const meta = yield clientQuery.countTotal();
    return { result, meta };
});

const getClientById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return client_model_1.Client.findById(id).lean();
});

const updateClient = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    return client_model_1.Client.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
});

const deleteClient = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return client_model_1.Client.findByIdAndDelete(id).lean();
});

const getClientWithStats = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield client_model_1.Client.aggregate([
        { $match: { _id: new (require('mongoose').Types.ObjectId)(id) } },
        {
            $lookup: {
                from: 'orders',
                localField: '_id',
                foreignField: 'clientId',
                as: 'orders',
            },
        },
        {
            $addFields: {
                totalOrders: { $size: '$orders' },
                totalRevenue: { $sum: '$orders.paidAmount' },
                completedOrders: {
                    $size: { $filter: { input: '$orders', as: 'o', cond: { $eq: ['$$o.status', 'Completed'] } } },
                },
            },
        },
    ]);
    return result[0] || null;
});

exports.ClientServices = {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient,
    getClientWithStats,
};
