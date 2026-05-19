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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
/**
 *
 * @param resourceType
 */
const uploadToCloudinary = (buffer_1, folder_1, ...args_1) => __awaiter(void 0, [buffer_1, folder_1, ...args_1], void 0, function* (buffer, folder, resourceType = 'image') {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: `portfolio/${folder}`,
            resource_type: resourceType,
            transformation: resourceType === 'image' ? [
                { width: 1200, crop: "limit" },
                { quality: "auto" },
                { fetch_format: "auto" }
            ] : undefined
        }, (error, result) => {
            if (error)
                return reject(error);
            resolve((result === null || result === void 0 ? void 0 : result.secure_url) || '');
        });
        uploadStream.end(buffer);
    });
});
exports.uploadToCloudinary = uploadToCloudinary;
/**
 *
 * @param url
 */
const deleteFromCloudinary = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parts = url.split('/');
        const fileNameWithExtension = parts.pop() || '';
        const folderPath = parts.slice(parts.indexOf('portfolio')).join('/');
        const publicId = `${folderPath}/${fileNameWithExtension.split('.')[0]}`;
        yield cloudinary_1.v2.uploader.destroy(publicId);
    }
    catch (error) {
        throw new Error('Cloudinary deletion failed');
    }
});
exports.deleteFromCloudinary = deleteFromCloudinary;
