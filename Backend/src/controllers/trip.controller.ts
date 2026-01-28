// controllers/trip.controller.ts
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import Trip, { ITrip } from '../models/trip.model';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';

// @desc    Get all trips with filtering, sorting, and pagination
// @route   GET /api/v1/trips
// @access  Public
export const getAllTrips = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Build query
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Trip.find(JSON.parse(queryStr));

    // Filter by category and type
    if (req.query.tripCategory) {
      query = query.find({ tripCategory: req.query.tripCategory });
    }
    if (req.query.tripType) {
      query = query.find({ tripType: req.query.tripType });
    }

    // Search functionality
    if (req.query.search) {
      query = query.find({
        $text: { $search: req.query.search as string },
      });
    }

    // Filter by status (only active trips for public)
    if (!req.query.status) {
      query = query.find({ status: 'Active' });
    }

    // Sorting
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = (req.query.fields as string).split(',').join(' ');
      query = query.select(fields);
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const trips = await query;
    const total = await Trip.countDocuments(JSON.parse(queryStr));

    res.status(200).json({
      status: 'success',
      results: trips.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: {
        trips,
      },
    });
  }
);

// @desc    Get single trip by ID
// @route   GET /api/v1/trips/:id
// @access  Public
export const getTripById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return next(new AppError('No trip found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        trip,
      },
    });
  }
);

// @desc    Create new trip
// @route   POST /api/v1/trips
// @access  Private (Admin)
export const createTrip = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Handle image upload
    let imageUrl = req.body.image;

    // If image file is uploaded
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'trips');
      imageUrl = result.secure_url;
    }

    // Parse JSON fields if they're strings
    let inclusions = req.body.inclusions;
    let exclusions = req.body.exclusions;
    let notes = req.body.notes;
    let itinerary = req.body.itinerary;
    let dates = req.body.dates;

    if (typeof inclusions === 'string') {
      inclusions = JSON.parse(inclusions);
    }
    if (typeof exclusions === 'string') {
      exclusions = JSON.parse(exclusions);
    }
    if (typeof notes === 'string') {
      notes = JSON.parse(notes);
    }
    if (typeof itinerary === 'string') {
      itinerary = JSON.parse(itinerary);
    }
    if (typeof dates === 'string') {
      dates = JSON.parse(dates);
    }

    // Calculate discount
    const discount = req.body.originalPrice - req.body.price;

    // Create trip
    const trip = await Trip.create({
      ...req.body,
      image: imageUrl,
      discount,
      inclusions,
      exclusions,
      notes,
      itinerary,
      dates,
    });

    res.status(201).json({
      status: 'success',
      data: {
        trip,
      },
    });
  }
);

// @desc    Update trip
// @route   PATCH /api/v1/trips/:id
// @access  Private (Admin)
export const updateTrip = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Find trip
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return next(new AppError('No trip found with that ID', 404));
    }

    // Handle image upload if new image is provided
    let imageUrl = req.body.image || trip.image;

    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (trip.image && trip.image.includes('cloudinary')) {
        await deleteFromCloudinary(trip.image);
      }
      const result = await uploadToCloudinary(req.file.buffer, 'trips');
      imageUrl = result.secure_url;
    }

    // Parse JSON fields if they're strings
    let inclusions = req.body.inclusions || trip.inclusions;
    let exclusions = req.body.exclusions || trip.exclusions;
    let notes = req.body.notes || trip.notes;
    let itinerary = req.body.itinerary || trip.itinerary;
    let dates = req.body.dates || trip.dates;

    if (typeof inclusions === 'string') {
      inclusions = JSON.parse(inclusions);
    }
    if (typeof exclusions === 'string') {
      exclusions = JSON.parse(exclusions);
    }
    if (typeof notes === 'string') {
      notes = JSON.parse(notes);
    }
    if (typeof itinerary === 'string') {
      itinerary = JSON.parse(itinerary);
    }
    if (typeof dates === 'string') {
      dates = JSON.parse(dates);
    }

    // Calculate discount
    const discount = req.body.originalPrice 
      ? req.body.originalPrice - req.body.price 
      : trip.discount;

    // Update trip
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        image: imageUrl,
        discount,
        inclusions,
        exclusions,
        notes,
        itinerary,
        dates,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        trip: updatedTrip,
      },
    });
  }
);

// @desc    Delete trip
// @route   DELETE /api/v1/trips/:id
// @access  Private (Admin)
export const deleteTrip = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return next(new AppError('No trip found with that ID', 404));
    }

    // Delete image from Cloudinary
    if (trip.image && trip.image.includes('cloudinary')) {
      await deleteFromCloudinary(trip.image);
    }
    if (trip.gallery && trip.gallery.length > 0) {
      const deletePromises = trip.gallery
        .filter((imageUrl) => imageUrl.includes('cloudinary'))
        .map((imageUrl) => deleteFromCloudinary(imageUrl));
      
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises);
      }
    }

    await Trip.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

// @desc    Get trips by category
// @route   GET /api/v1/trips/category/:category
// @access  Public
export const getTripsByCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { category } = req.params;
    
    const trips = await Trip.find({ 
      tripCategory: category,
      status: 'Active'
    }).sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: trips.length,
      data: {
        trips,
      },
    });
  }
);

// @desc    Get trips by type
// @route   GET /api/v1/trips/type/:type
// @access  Public
export const getTripsByType = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.params;
    
    const trips = await Trip.find({ 
      tripType: type,
      status: 'Active'
    }).sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: trips.length,
      data: {
        trips,
      },
    });
  }
);

// @desc    Get featured trips
// @route   GET /api/v1/trips/featured
// @access  Public
export const getFeaturedTrips = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const limit = parseInt(req.query.limit as string) || 6;
    
    const trips = await Trip.find({ 
      status: 'Active',
    })
      .sort('-bookings')
      .limit(limit);

    res.status(200).json({
      status: 'success',
      results: trips.length,
      data: {
        trips,
      },
    });
  }
);

// @desc    Get trip statistics
// @route   GET /api/v1/trips/stats
// @access  Private (Admin)
export const getTripStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const totalTrips = await Trip.countDocuments();
    const activeTrips = await Trip.countDocuments({ status: 'Active' });
    const inactiveTrips = await Trip.countDocuments({ status: 'Inactive' });
    const draftTrips = await Trip.countDocuments({ status: 'Draft' });
    
    const totalBookings = await Trip.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$bookings' },
        },
      },
    ]);

    const avgPrice = await Trip.aggregate([
      {
        $group: {
          _id: null,
          average: { $avg: '$price' },
        },
      },
    ]);

    const tripsByCategory = await Trip.aggregate([
      {
        $group: {
          _id: '$tripCategory',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalTrips,
        activeTrips,
        inactiveTrips,
        draftTrips,
        totalBookings: totalBookings[0]?.total || 0,
        avgPrice: Math.round(avgPrice[0]?.average || 0),
        tripsByCategory,
      },
    });
  }
);