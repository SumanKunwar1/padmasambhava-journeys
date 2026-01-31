// controllers/insurance.controller.ts
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import Insurance, { IInsurance } from '../models/Insurance.model';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';

// Helper function to calculate insurance premium
const calculatePremium = (
  planType: string,
  tripType: string,
  tripDuration: number,
  numberOfTravelers: number,
  additionalCoverages: any
): number => {
  let basePrice = 0;

  // Base price based on plan type
  const planPrices: { [key: string]: number } = {
    Basic: 500,
    Standard: 1000,
    Premium: 2000,
    Family: 3500,
  };

  basePrice = planPrices[planType] || 500;

  // Multiply by trip type
  if (tripType === 'International') {
    basePrice *= 2;
  }

  // Duration multiplier (per day after 7 days)
  if (tripDuration > 7) {
    basePrice += (tripDuration - 7) * 100;
  }

  // Number of travelers
  if (planType !== 'Family') {
    basePrice *= numberOfTravelers;
  }

  // Additional coverages
  let additionalCost = 0;
  if (additionalCoverages.adventureSports) additionalCost += 500;
  if (additionalCoverages.preExistingConditions) additionalCost += 1000;
  if (additionalCoverages.seniorCitizen) additionalCost += 800;
  if (additionalCoverages.pregnancy) additionalCost += 1200;
  if (additionalCoverages.valuables) additionalCost += 300;

  return basePrice + additionalCost;
};

// Helper function to generate policy number
const generatePolicyNumber = (): string => {
  const prefix = 'TI';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

// @desc    Get all insurance applications with filtering
// @route   GET /api/v1/insurance
// @access  Private (Admin)
export const getAllInsurance = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Build query
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let query = Insurance.find(queryObj);

    // Sorting
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const applications = await query;
    const total = await Insurance.countDocuments(queryObj);

    res.status(200).json({
      status: 'success',
      results: applications.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: {
        applications,
      },
    });
  }
);

// @desc    Get single insurance application
// @route   GET /api/v1/insurance/:id
// @access  Private
export const getInsuranceById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const application = await Insurance.findById(req.params.id);

    if (!application) {
      return next(new AppError('No insurance application found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        application,
      },
    });
  }
);

// @desc    Create insurance application
// @route   POST /api/v1/insurance
// @access  Public
export const createInsurance = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Parse JSON fields if they're strings
    let travelers = req.body.travelers;
    let additionalCoverages = req.body.additionalCoverages;

    if (typeof travelers === 'string') {
      travelers = JSON.parse(travelers);
    }
    if (typeof additionalCoverages === 'string') {
      additionalCoverages = JSON.parse(additionalCoverages);
    }

    // Handle file uploads
    let passportCopy = req.body.passportCopy;
    const medicalDocuments: string[] = [];

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // Upload passport copy
      if (files.passportCopy && files.passportCopy[0]) {
        const result = await uploadToCloudinary(files.passportCopy[0].buffer, 'insurance/passports');
        passportCopy = result.secure_url;
      }

      // Upload medical documents
      if (files.medicalDocuments) {
        for (const file of files.medicalDocuments) {
          const result = await uploadToCloudinary(file.buffer, 'insurance/medical');
          medicalDocuments.push(result.secure_url);
        }
      }
    }

    // Calculate trip duration
    const departureDate = new Date(req.body.departureDate);
    const returnDate = new Date(req.body.returnDate);
    const tripDuration = Math.ceil((returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate total amount
    const totalAmount = calculatePremium(
      req.body.planType,
      req.body.tripType,
      tripDuration,
      parseInt(req.body.numberOfTravelers),
      additionalCoverages
    );

    // Create insurance application
    const application = await Insurance.create({
      ...req.body,
      travelers,
      additionalCoverages,
      passportCopy,
      medicalDocuments,
      tripDuration,
      totalAmount,
    });

    res.status(201).json({
      status: 'success',
      data: {
        application,
      },
    });
  }
);

// @desc    Update insurance application
// @route   PATCH /api/v1/insurance/:id
// @access  Private (Admin)
export const updateInsurance = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const application = await Insurance.findById(req.params.id);

    if (!application) {
      return next(new AppError('No insurance application found with that ID', 404));
    }

    // Parse JSON fields if they're strings
    let travelers = req.body.travelers || application.travelers;
    let additionalCoverages = req.body.additionalCoverages || application.additionalCoverages;

    if (typeof travelers === 'string') {
      travelers = JSON.parse(travelers);
    }
    if (typeof additionalCoverages === 'string') {
      additionalCoverages = JSON.parse(additionalCoverages);
    }

    // Handle file uploads
    let passportCopy = req.body.passportCopy || application.passportCopy;
    let medicalDocuments = application.medicalDocuments || [];

    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (files.passportCopy && files.passportCopy[0]) {
        // Delete old passport copy
        if (application.passportCopy && application.passportCopy.includes('cloudinary')) {
          await deleteFromCloudinary(application.passportCopy);
        }
        const result = await uploadToCloudinary(files.passportCopy[0].buffer, 'insurance/passports');
        passportCopy = result.secure_url;
      }

      if (files.medicalDocuments) {
        for (const file of files.medicalDocuments) {
          const result = await uploadToCloudinary(file.buffer, 'insurance/medical');
          medicalDocuments.push(result.secure_url);
        }
      }
    }

    // Update application
    const updatedApplication = await Insurance.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        travelers,
        additionalCoverages,
        passportCopy,
        medicalDocuments,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        application: updatedApplication,
      },
    });
  }
);

// @desc    Approve insurance application
// @route   PATCH /api/v1/insurance/:id/approve
// @access  Private (Admin)
export const approveInsurance = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const application = await Insurance.findById(req.params.id);

    if (!application) {
      return next(new AppError('No insurance application found with that ID', 404));
    }

    // Generate policy number if not already generated
    const policyNumber = application.policyNumber || generatePolicyNumber();

    const updatedApplication = await Insurance.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Approved',
        policyNumber,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'Insurance application approved successfully',
      data: {
        application: updatedApplication,
      },
    });
  }
);

// @desc    Delete insurance application
// @route   DELETE /api/v1/insurance/:id
// @access  Private (Admin)
export const deleteInsurance = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const application = await Insurance.findById(req.params.id);

    if (!application) {
      return next(new AppError('No insurance application found with that ID', 404));
    }

    // Delete uploaded files from Cloudinary
    if (application.passportCopy && application.passportCopy.includes('cloudinary')) {
      await deleteFromCloudinary(application.passportCopy);
    }

    if (application.medicalDocuments && application.medicalDocuments.length > 0) {
      const deletePromises = application.medicalDocuments
        .filter((url) => url.includes('cloudinary'))
        .map((url) => deleteFromCloudinary(url));
      
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
      }
    }

    await Insurance.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

// @desc    Get insurance statistics
// @route   GET /api/v1/insurance/stats
// @access  Private (Admin)
export const getInsuranceStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const totalApplications = await Insurance.countDocuments();
    const pendingApplications = await Insurance.countDocuments({ status: 'Pending' });
    const approvedApplications = await Insurance.countDocuments({ status: 'Approved' });
    const activeApplications = await Insurance.countDocuments({ status: 'Active' });

    const totalRevenue = await Insurance.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const applicationsByPlan = await Insurance.aggregate([
      { $group: { _id: '$planType', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalApplications,
        pendingApplications,
        approvedApplications,
        activeApplications,
        totalRevenue: totalRevenue[0]?.total || 0,
        applicationsByPlan,
      },
    });
  }
);