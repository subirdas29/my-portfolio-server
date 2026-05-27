import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ClientServices } from './client.service';

const createClientController = catchAsync(async (req, res) => {
  const result = await ClientServices.createClient(req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Client created successfully', data: result });
});

const getAllClientsController = catchAsync(async (req, res) => {
  const result = await ClientServices.getAllClients(req.query as Record<string, unknown>);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Clients fetched successfully', data: result });
});

const getClientByIdController = catchAsync(async (req, res) => {
  const result = await ClientServices.getClientById(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Client fetched successfully', data: result });
});

const getClientWithStatsController = catchAsync(async (req, res) => {
  const result = await ClientServices.getClientWithStats(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Client stats fetched', data: result });
});

const updateClientController = catchAsync(async (req, res) => {
  const result = await ClientServices.updateClient(req.params.id as string, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Client updated successfully', data: result });
});

const deleteClientController = catchAsync(async (req, res) => {
  await ClientServices.deleteClient(req.params.id as string);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Client deleted successfully', data: null });
});

export const ClientController = {
  createClientController, getAllClientsController, getClientByIdController,
  getClientWithStatsController, updateClientController, deleteClientController,
};
