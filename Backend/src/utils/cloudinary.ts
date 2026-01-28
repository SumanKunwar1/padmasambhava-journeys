// utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/env';
import streamifier from 'streamifier';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

// Upload image to Cloudinary
export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string = 'trips'
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `${config.cloudinaryFolder}/${folder}`,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto:good' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Delete image from Cloudinary
export const deleteFromCloudinary = async (
  imageUrl: string
): Promise<void> => {
  try {
    // Extract public_id from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const folderPath = urlParts.slice(urlParts.indexOf(config.cloudinaryFolder)).join('/');
    const publicId = folderPath.replace('.' + fileName.split('.').pop(), '');

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
};

export default cloudinary;