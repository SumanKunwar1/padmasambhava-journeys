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
  port: parseInt(process.env.PORT || '5020', 10),
  // FIXED: Use CLIENT_URL from .env (not FRONTEND_URL)
  clientUrl: process.env.CLIENT_URL || 'http://localhost:8080',
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

// Log configuration in development (for debugging CORS issues)
if (process.env.NODE_ENV === 'development') {
  console.log('✅ Configuration loaded:');
  console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`   PORT: ${process.env.PORT || 5020}`);
  console.log(`   CLIENT_URL: ${process.env.CLIENT_URL || 'http://localhost:8080'}`);
}

// Validate critical environment variables in production
if (process.env.NODE_ENV === 'production') {
  const requiredVars = ['MONGO_URI', 'JWT_SECRET', 'CLIENT_URL'];
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.error(`❌ Missing critical environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
  
  console.log('✅ Production configuration validated:');
  console.log(`   CLIENT_URL: ${process.env.CLIENT_URL}`);
}