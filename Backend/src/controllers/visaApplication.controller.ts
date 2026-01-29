// controllers/visaApplication.controller.ts
import { Request, Response, NextFunction } from 'express';
import { VisaApplication } from '../models/visaApplication.model';
import { AppError } from '../utils/appError';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import { catchAsync } from '../utils/catchAsync';

// @desc    Submit a new visa application
// @route   POST /api/v1/visa-applications
// @access  Public
export const submitVisaApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('📝 Received visa application submission');
      console.log('Request body:', req.body);
      console.log('Request files:', req.files);

      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Validate required fields
      const requiredFields = [
        'fullName', 'gender', 'dateOfBirth', 'placeOfBirth', 'nationality',
        'maritalStatus', 'occupation', 'passportType', 'passportNumber',
        'placeOfIssue', 'dateOfIssue', 'dateOfExpiry', 'issuingCountry',
        'residentialAddress', 'city', 'country', 'postalCode', 'phone', 'email',
        'destinationCountry', 'purposeOfVisit', 'arrivalDate', 'departureDate',
        'durationOfStay', 'numberOfEntries', 'accommodationType', 'accommodationAddress',
        'expensesBearer', 'estimatedBudget', 'sufficientFunds',
        'travelledBefore', 'overstayedVisa', 'refusedVisa', 'hasInsurance'
      ];

      const missingFields = requiredFields.filter(field => !req.body[field]);
      if (missingFields.length > 0) {
        console.log('❌ Missing required fields:', missingFields);
        return next(new AppError(`Missing required fields: ${missingFields.join(', ')}`, 400));
      }

      // Validate required files
      if (!files?.passportBioFile?.[0]) {
        console.log('❌ Missing passport bio file');
        return next(new AppError('Passport bio page is required', 400));
      }

      if (!files?.passportPhotoFile?.[0]) {
        console.log('❌ Missing passport photo file');
        return next(new AppError('Passport photo is required', 400));
      }

      // Upload files to Cloudinary and extract URLs
      let passportBioUrl: string = '';
      let passportPhotoUrl: string = '';
      let supportingDocsUrl: string | undefined;

      try {
        console.log('☁️ Uploading passport bio file to Cloudinary...');
        const passportBioResult = await uploadToCloudinary(
          files.passportBioFile[0].buffer,
          'visa-applications/passports'
        );
        
        // Extract URL from Cloudinary response
        passportBioUrl = typeof passportBioResult === 'string' 
          ? passportBioResult 
          : (passportBioResult as any).secure_url || (passportBioResult as any).url;
        
        console.log('✅ Passport bio uploaded:', passportBioUrl);
      } catch (error: any) {
        console.error('❌ Error uploading passport bio:', error);
        return next(new AppError('Failed to upload passport bio page', 500));
      }

      try {
        console.log('☁️ Uploading passport photo to Cloudinary...');
        const passportPhotoResult = await uploadToCloudinary(
          files.passportPhotoFile[0].buffer,
          'visa-applications/photos'
        );
        
        // Extract URL from Cloudinary response
        passportPhotoUrl = typeof passportPhotoResult === 'string' 
          ? passportPhotoResult 
          : (passportPhotoResult as any).secure_url || (passportPhotoResult as any).url;
        
        console.log('✅ Passport photo uploaded:', passportPhotoUrl);
      } catch (error: any) {
        console.error('❌ Error uploading passport photo:', error);
        // Delete already uploaded passport bio
        if (passportBioUrl) {
          await deleteFromCloudinary(passportBioUrl);
        }
        return next(new AppError('Failed to upload passport photo', 500));
      }

      if (files?.supportingDocumentsFile?.[0]) {
        try {
          console.log('☁️ Uploading supporting documents to Cloudinary...');
          const supportingDocsResult = await uploadToCloudinary(
            files.supportingDocumentsFile[0].buffer,
            'visa-applications/documents'
          );
          
          // Extract URL from Cloudinary response
          supportingDocsUrl = typeof supportingDocsResult === 'string' 
            ? supportingDocsResult 
            : (supportingDocsResult as any).secure_url || (supportingDocsResult as any).url;
          
          console.log('✅ Supporting documents uploaded:', supportingDocsUrl);
        } catch (error: any) {
          console.error('⚠️ Error uploading supporting documents:', error);
          // Don't fail the entire request if optional document fails
          supportingDocsUrl = undefined;
        }
      }

      // Parse boolean value
      const agreeToTerms = req.body.agreeToTerms === 'true' || req.body.agreeToTerms === true;

      if (!agreeToTerms) {
        // Clean up uploaded files
        if (passportBioUrl) await deleteFromCloudinary(passportBioUrl);
        if (passportPhotoUrl) await deleteFromCloudinary(passportPhotoUrl);
        if (supportingDocsUrl) await deleteFromCloudinary(supportingDocsUrl);
        return next(new AppError('You must agree to the terms and conditions', 400));
      }

      // Create visa application
      console.log('💾 Creating visa application in database...');
      console.log('URLs to save:', {
        passportBioFile: passportBioUrl,
        passportPhotoFile: passportPhotoUrl,
        supportingDocumentsFile: supportingDocsUrl
      });

      const visaApplication = await VisaApplication.create({
        ...req.body,
        passportBioFile: passportBioUrl,
        passportPhotoFile: passportPhotoUrl,
        supportingDocumentsFile: supportingDocsUrl,
        userId: (req as any).user?._id,
        agreeToTerms: agreeToTerms,
        submittedDate: new Date(),
        status: 'New',
      });

      console.log('✅ Visa application created successfully:', visaApplication._id);

      res.status(201).json({
        status: 'success',
        message: 'Visa application submitted successfully',
        data: {
          application: visaApplication,
        },
      });
    } catch (error: any) {
      console.error('❌ Error in submitVisaApplication:', error);
      
      // Handle duplicate passport number
      if (error.code === 11000 && error.keyPattern?.passportNumber) {
        return next(new AppError('An application with this passport number already exists', 400));
      }

      // Handle validation errors
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err: any) => err.message);
        return next(new AppError(`Validation error: ${messages.join(', ')}`, 400));
      }

      return next(new AppError(error.message || 'Error submitting visa application', 500));
    }
  }
);

// @desc    Get all visa applications (Admin)
// @route   GET /api/v1/visa-applications
// @access  Private/Admin
export const getAllVisaApplications = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status, search, page = 1, limit = 10 } = req.query;

    const query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { passportNumber: { $regex: search, $options: 'i' } },
        { destinationCountry: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const applications = await VisaApplication.find(query)
      .populate('userId', 'fullName email')
      .sort({ submittedDate: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await VisaApplication.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: applications.length,
      data: {
        applications,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }
);

// @desc    Get single visa application
// @route   GET /api/v1/visa-applications/:id
// @access  Private
export const getVisaApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const application = await VisaApplication.findById(req.params.id).populate('userId', 'fullName email');

    if (!application) {
      return next(new AppError('Visa application not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        application,
      },
    });
  }
);

// @desc    Get my visa applications
// @route   GET /api/v1/visa-applications/my-applications
// @access  Private
export const getMyVisaApplications = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const applications = await VisaApplication.find({ userId: (req as any).user?._id }).sort({ submittedDate: -1 });

    res.status(200).json({
      status: 'success',
      results: applications.length,
      data: {
        applications,
      },
    });
  }
);

// @desc    Update visa application status (Admin)
// @route   PATCH /api/v1/visa-applications/:id
// @access  Private/Admin
export const updateVisaApplicationStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status, adminNotes } = req.body;

    const validStatuses = ['New', 'Under Review', 'Approved', 'Rejected', 'More Info Required'];
    if (status && !validStatuses.includes(status)) {
      return next(new AppError('Invalid status value', 400));
    }

    const application = await VisaApplication.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNotes,
        updatedDate: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!application) {
      return next(new AppError('Visa application not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Visa application updated successfully',
      data: {
        application,
      },
    });
  }
);

// @desc    Delete visa application (Admin)
// @route   DELETE /api/v1/visa-applications/:id
// @access  Private/Admin
export const deleteVisaApplication = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const application = await VisaApplication.findById(req.params.id);

    if (!application) {
      return next(new AppError('Visa application not found', 404));
    }

    // Delete files from Cloudinary
    const deletePromises = [];
    if (application.passportBioFile) {
      deletePromises.push(deleteFromCloudinary(application.passportBioFile));
    }
    if (application.passportPhotoFile) {
      deletePromises.push(deleteFromCloudinary(application.passportPhotoFile));
    }
    if (application.supportingDocumentsFile) {
      deletePromises.push(deleteFromCloudinary(application.supportingDocumentsFile));
    }

    await Promise.all(deletePromises);
    await application.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Visa application deleted successfully',
    });
  }
);

// @desc    Get visa application statistics (Admin)
// @route   GET /api/v1/visa-applications/admin/stats
// @access  Private/Admin
export const getVisaApplicationStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const stats = await VisaApplication.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await VisaApplication.countDocuments();

    const formattedStats = {
      total,
      byStatus: stats.reduce((acc: any, stat: any) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
    };

    res.status(200).json({
      status: 'success',
      data: {
        stats: formattedStats,
      },
    });
  }
);