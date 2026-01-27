// config/env.ts
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  nodeEnv: string;
  port: number;
  clientUrl: string;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtCookieExpiresIn: number;
  emailHost: string;
  emailPort: number;
  emailUser: string;
  emailPassword: string;
  emailFrom: string;
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
  cloudinaryFolder: string;
  cloudinaryMaxFileSize: number;
  razorpayKeyId: string;
  razorpayKeySecret: string;
}

export const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/padmasambhava-trips',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-this',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  jwtCookieExpiresIn: parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '7', 10),
  emailHost: process.env.EMAIL_HOST || 'smtp.gmail.com',
  emailPort: parseInt(process.env.EMAIL_PORT || '587', 10),
  emailUser: process.env.EMAIL_USER || '',
  emailPassword: process.env.EMAIL_PASSWORD || '',
  emailFrom: process.env.EMAIL_FROM || 'noreply@padmasambhavatrip.com',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
  cloudinaryFolder: process.env.CLOUDINARY_FOLDER || 'padmasambhava-trips',
  cloudinaryMaxFileSize: parseInt(process.env.CLOUDINARY_MAX_FILE_SIZE || '5242880', 10),
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
};