"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const settings_service_1 = require("./settings.service");
const getSettingsController = (0, catchAsync_1.default)(async (_req, res) => { const r = await settings_service_1.SettingsServices.getSettings(); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Settings fetched', data: r }); });
const updateSettingsController = (0, catchAsync_1.default)(async (req, res) => { const r = await settings_service_1.SettingsServices.updateSettings(req.body); (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Settings updated', data: r }); });
exports.SettingsController = { getSettingsController, updateSettingsController };
//# sourceMappingURL=settings.controller.js.map