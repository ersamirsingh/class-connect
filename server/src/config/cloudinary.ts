import { v2 as cloudinary } from 'cloudinary';
import { config } from './index';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '123456789',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'secret',
});

export const uploadToCloudinary = async (fileBuffer: Buffer, mimeType: string, folder = 'class-connect'): Promise<string> => {
  // If real Cloudinary keys are provided, upload to Cloudinary
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'auto' },
        (error, result) => {
          if (error) return reject(error);
          if (result && result.secure_url) resolve(result.secure_url);
          else reject(new Error('Cloudinary upload failed: secure_url missing'));
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  // Fallback: encode as data URI for local dev/testing without active Cloudinary API keys
  const base64 = fileBuffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
};

export { cloudinary };
