"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploadRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fileUpload_controller_1 = require("./fileUpload.controller");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage, limits: { fileSize: 100 * 1024 * 1024 } });
router.post('/image', upload.single('file'), fileUpload_controller_1.FileUploadController.uploadImage);
router.post('/upload-raw', upload.single('file'), fileUpload_controller_1.FileUploadController.uploadRawFile);
router.delete('/delete', fileUpload_controller_1.FileUploadController.deleteFile);
exports.fileUploadRoutes = router;
//# sourceMappingURL=fileUpload.route.js.map