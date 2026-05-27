import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SettingsServices } from './settings.service';

const getSettingsController = catchAsync(async (_req, res) => { const r = await SettingsServices.getSettings(); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Settings fetched', data: r }); });
const updateSettingsController = catchAsync(async (req, res) => { const r = await SettingsServices.updateSettings(req.body); sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Settings updated', data: r }); });

export const SettingsController = { getSettingsController, updateSettingsController };
