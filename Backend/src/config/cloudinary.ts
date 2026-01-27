// config/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import { config } from './env';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
  secure: true, // Use HTTPS
});

// Verify configuration
export const verifyCloudinaryConfig = (): boolean => {
  const { cloud_name, api_key, api_secret } = cloudinary.config();
  
  if (!cloud_name || !api_key || !api_secret) {
    console.warn('⚠️  Cloudinary credentials not configured properly');
    return false;
  }
  
  console.log('✅ Cloudinary configured successfully');
  return true;
};

export default cloudinary;