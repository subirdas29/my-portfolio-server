import { v2 as cloudinary } from 'cloudinary';



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * 
 * @param resourceType 
 */
export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: `portfolio/${folder}`,
        resource_type: resourceType,
     
        transformation: resourceType === 'image' ? [
          { width: 1200, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" }
        ] : undefined
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result?.secure_url || '');
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * 
 * @param url 
 */
export const deleteFromCloudinary = async (url: string) => {
  try {
 
    const parts = url.split('/');
    const fileNameWithExtension = parts.pop() || '';
    const folderPath = parts.slice(parts.indexOf('portfolio')).join('/');
    const publicId = `${folderPath}/${fileNameWithExtension.split('.')[0]}`;

  
    await cloudinary.uploader.destroy(publicId);
  } catch (error:any) {
    throw new Error('Cloudinary deletion failed');
  }
};