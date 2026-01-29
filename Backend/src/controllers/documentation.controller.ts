// controllers/documentation.controller.ts
import { Request, Response, NextFunction } from 'express';
import { Documentation } from '../models/Documentation.model';
import { AppError } from '../utils/appError';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import { catchAsync } from '../utils/catchAsync';

// @desc    Upload document
// @route   POST /api/v1/documentation/upload
// @access  Private
export const uploadDocument = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { documentId, name, category, description, status } = req.body;
    const file = req.file;

    if (!file) {
      return next(new AppError('Please upload a file', 400));
    }

    // Upload to Cloudinary
    const fileUrl = await uploadToCloudinary(file.buffer, `documentation/general`);

    // Check if document already exists for this user
    let document = await Documentation.findOne({
      userId: (req as any).user?._id,
      documentId,
    });

    if (document) {
      // Delete old file from Cloudinary
      if (document.fileUrl) {
        await deleteFromCloudinary(document.fileUrl);
      }

      // Update existing document
      document.fileUrl = fileUrl;
      document.fileName = file.originalname;
      document.fileSize = file.size;
      document.uploadDate = new Date();
      document.isUploaded = true;
      await document.save();
    } else {
      // Create new document
      document = await Documentation.create({
        userId: (req as any).user?._id,
        documentId,
        name,
        category,
        description,
        status: status || 'optional',
        fileUrl,
        fileName: file.originalname,
        fileSize: file.size,
        uploadDate: new Date(),
        isUploaded: true,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Document uploaded successfully',
      data: {
        document,
      },
    });
  }
);

// @desc    Get user documents
// @route   GET /api/v1/documentation/my-documents
// @access  Private
export const getMyDocuments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const documents = await Documentation.find({ 
      userId: (req as any).user?._id 
    }).sort({ uploadDate: -1 });

    res.status(200).json({
      status: 'success',
      results: documents.length,
      data: {
        documents,
      },
    });
  }
);

// @desc    Get all documents (Admin)
// @route   GET /api/v1/documentation
// @access  Private/Admin
export const getAllDocuments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, page = 1, limit = 100 } = req.query;

    const query: any = {};

    if (userId) {
      query.userId = userId;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const documents = await Documentation.find(query)
      .populate('userId', 'fullName email phoneNumber')
      .sort({ uploadDate: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Documentation.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: documents.length,
      data: {
        documents,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }
);

// @desc    Get single document
// @route   GET /api/v1/documentation/:id
// @access  Private
export const getDocument = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const document = await Documentation.findById(req.params.id).populate('userId', 'fullName email phoneNumber');

    if (!document) {
      return next(new AppError('Document not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        document,
      },
    });
  }
);

// @desc    Delete document
// @route   DELETE /api/v1/documentation/:id
// @access  Private
export const deleteDocument = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const document = await Documentation.findById(req.params.id);

    if (!document) {
      return next(new AppError('Document not found', 404));
    }

    // Check if user owns the document or is admin
    if (document.userId?.toString() !== (req as any).user?._id.toString() && (req as any).user?.role !== 'admin') {
      return next(new AppError('You do not have permission to delete this document', 403));
    }

    // Delete from Cloudinary
    if (document.fileUrl) {
      await deleteFromCloudinary(document.fileUrl);
    }

    await document.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Document deleted successfully',
    });
  }
);

// @desc    Get document upload progress
// @route   GET /api/v1/documentation/progress
// @access  Private
export const getDocumentProgress = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const totalDocuments = await Documentation.countDocuments({ 
      userId: (req as any).user?._id 
    });
    const uploadedDocuments = await Documentation.countDocuments({ 
      userId: (req as any).user?._id,
      isUploaded: true 
    });

    const progress = totalDocuments > 0 ? (uploadedDocuments / totalDocuments) * 100 : 0;

    res.status(200).json({
      status: 'success',
      data: {
        totalDocuments,
        uploadedDocuments,
        progress: Math.round(progress),
      },
    });
  }
);