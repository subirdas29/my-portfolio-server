"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadController = void 0;
const utility_1 = require("../../utils/utility");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const uploadImage = (0, catchAsync_1.default)(async (req, res) => {
    if (!req.file)
        throw new Error('No file uploaded');
    const secureUrl = await (0, utility_1.uploadToCloudinary)(req.file.buffer, 'images', 'image');
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Image uploaded successfully', data: secureUrl });
});
const uploadRawFile = (0, catchAsync_1.default)(async (req, res) => {
    if (!req.file)
        throw new Error('No file uploaded');
    const resourceType = req.file.mimetype.startsWith('video') ? 'video' : 'raw';
    const secureUrl = await (0, utility_1.uploadToCloudinary)(req.file.buffer, 'others', resourceType);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'File uploaded successfully', data: secureUrl });
});
const deleteFile = (0, catchAsync_1.default)(async (req, res) => {
    const { url } = req.body;
    if (!url)
        throw new Error('URL is required');
    await (0, utility_1.deleteFromCloudinary)(url);
    (0, sendResponse_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'File deleted successfully from Cloudinary', data: null });
});
exports.FileUploadController = { uploadImage, uploadRawFile, deleteFile };
//# sourceMappingURL=fileUpload.controller.js.map