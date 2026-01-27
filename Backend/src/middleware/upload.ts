// middleware/upload.ts
import multer from 'multer';
import { Request } from 'express';
import { AppError } from '../utils/appError';

// Multer configuration for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Allow only images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400) as any, false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Export different upload configurations
export const uploadSingle = upload.single('image');
export const uploadMultiple = upload.array('images', 10); // Max 10 images
export const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'gallery', maxCount: 10 },
]);

export default upload;