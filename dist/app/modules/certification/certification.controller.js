"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificationController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const certification_service_1 = require("./certification.service");
const createCertificationController = (0, catchAsync_1.default)(async (req, res) => {
    const result = await certification_service_1.CertificationServices.createCertification(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Certification created successfully',
        data: result,
    });
});
const getAllCertificationsController = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await certification_service_1.CertificationServices.getAllCertifications();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Certifications fetched successfully',
        data: result,
    });
});
const updateCertificationController = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await certification_service_1.CertificationServices.updateCertification(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Certification updated successfully',
        data: result,
    });
});
const deleteCertificationController = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    await certification_service_1.CertificationServices.deleteCertification(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Certification deleted successfully',
        data: null,
    });
});
exports.CertificationController = {
    createCertificationController,
    getAllCertificationsController,
    updateCertificationController,
    deleteCertificationController,
};
//# sourceMappingURL=certification.controller.js.map