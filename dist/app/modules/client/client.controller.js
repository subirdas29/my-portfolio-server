"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const client_service_1 = require("./client.service");
const createClientController = (0, catchAsync_1.default)(async (req, res) => {
    const result = await client_service_1.ClientServices.createClient(req.body);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.CREATED, success: true, message: 'Client created successfully', data: result });
});
const getAllClientsController = (0, catchAsync_1.default)(async (req, res) => {
    const result = await client_service_1.ClientServices.getAllClients(req.query);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Clients fetched successfully', data: result });
});
const getClientByIdController = (0, catchAsync_1.default)(async (req, res) => {
    const result = await client_service_1.ClientServices.getClientById(req.params.id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Client fetched successfully', data: result });
});
const getClientWithStatsController = (0, catchAsync_1.default)(async (req, res) => {
    const result = await client_service_1.ClientServices.getClientWithStats(req.params.id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Client stats fetched', data: result });
});
const updateClientController = (0, catchAsync_1.default)(async (req, res) => {
    const result = await client_service_1.ClientServices.updateClient(req.params.id, req.body);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Client updated successfully', data: result });
});
const deleteClientController = (0, catchAsync_1.default)(async (req, res) => {
    await client_service_1.ClientServices.deleteClient(req.params.id);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Client deleted successfully', data: null });
});
exports.ClientController = {
    createClientController, getAllClientsController, getClientByIdController,
    getClientWithStatsController, updateClientController, deleteClientController,
};
//# sourceMappingURL=client.controller.js.map