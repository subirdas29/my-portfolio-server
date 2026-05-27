"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const uploadToCloudinary = (buffer, folder, resourceType = 'image') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: `portfolio/${folder}`,
            resource_type: resourceType,
            transformation: resourceType === 'image'
                ? [{ width: 1200, crop: 'limit' }, { quality: 'auto' }, { fetch_format: 'auto' }]
                : undefined,
        }, (error, result) => {
            if (error)
                return reject(error);
            resolve((result === null || result === void 0 ? void 0 : result.secure_url) || '');
        });
        uploadStream.end(buffer);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
const deleteFromCloudinary = async (url) => {
    try {
        const parts = url.split('/');
        const fileNameWithExtension = parts.pop() || '';
        const folderPath = parts.slice(parts.indexOf('portfolio')).join('/');
        const publicId = `${folderPath}/${fileNameWithExtension.split('.')[0]}`;
        await cloudinary_1.v2.uploader.destroy(publicId);
    }
    catch (error) {
        throw new Error('Cloudinary deletion failed');
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
//# sourceMappingURL=utility.js.map