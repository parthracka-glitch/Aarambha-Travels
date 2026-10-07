import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary from discrete variables or CLOUDINARY_URL
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
  });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '682429835875719',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'HaWm89eMSR9A_3DRZTBqM_gqicY',
    secure: true,
  });
}

export const isCloudinaryConfigured = (): boolean => {
  const config = cloudinary.config();
  return Boolean(config.cloud_name && config.api_key && config.api_secret);
};

/**
 * Upload an image buffer directly to Cloudinary
 */
export const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder = 'aarambha_travels',
  filename?: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      return reject(new Error('Cloudinary is not fully configured. Please set CLOUDINARY_CLOUD_NAME.'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        public_id: filename ? filename.replace(/\.[^/.]+$/, '') : undefined,
        overwrite: true,
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ],
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error('Upload failed with empty result'));
        }
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
};

/**
 * Delete an image by its public_id
 */
export const deleteFromCloudinary = async (publicId: string): Promise<any> => {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured');
  }
  return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
};

export default cloudinary;
