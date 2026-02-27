// controllers/agentTrip.controller.ts
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import AgentTrip from '../models/AgentTrip.model';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';

// @desc    Create new agent trip
// @route   POST /api/v1/agent-trips
// @access  Private (Admin)
export const createAgentTrip = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      name,
      destination,
      duration,
      description,
      price,
      b2bPrice,
      originalPrice,
      discount,
      commission,
      image,
      inclusions,
      exclusions,
      notes,
      itinerary,
      dates,
      hasGoodies,
      tripCategory,
      tripType,
      occupancyPricing,
    } = req.body;

    // Validate required fields
    if (!name || !destination || !duration || !price || !b2bPrice) {
      return next(
        new AppError('Please provide all required fields: name, destination, duration, price, b2bPrice', 400)
      );
    }

    // Validate B2B price is less than retail price
    if (b2bPrice >= price) {
      return next(new AppError('B2B price must be less than retail price', 400));
    }

    // Handle image upload if file is provided
    let imageUrl = image || '';
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'agent-trips');
      imageUrl = result.secure_url;
    }

    // Create agent trip
    const agentTrip = await AgentTrip.create({
      name,
      destination,
      duration,
      description: description || '',
      price,
      b2bPrice,
      originalPrice: originalPrice || price,
      discount: discount || 0,
      commission: commission || 0, // Will be auto-calculated if 0
      image: imageUrl,
      inclusions: inclusions || [],
      exclusions: exclusions || [],
      notes: notes || [],
      itinerary: itinerary || [],
      dates: dates || [],
      occupancyPricing: occupancyPricing || [],
      hasGoodies: hasGoodies || false,
      tripCategory: tripCategory || 'india-trips',
      tripType: tripType || '',
    });

    res.status(201).json({
      status: 'success',
      message: 'Agent trip created successfully',
      data: {
        trip: agentTrip,
      },
    });
  }
);

// @desc    Get all agent trips
// @route   GET /api/v1/agent-trips
// @access  Public (for agents)
export const getAllAgentTrips = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      search,
      destination,
      tripCategory,
      tripType,
      minPrice,
      maxPrice,
      page = 1,
      limit = 50,
      sort = '-createdAt',
    } = req.query;

    const query: any = { isActive: true };

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by destination
    if (destination && destination !== 'All') {
      query.destination = { $regex: destination, $options: 'i' };
    }

    // Filter by trip category
    if (tripCategory) {
      query.tripCategory = tripCategory;
    }

    // Filter by trip type
    if (tripType) {
      query.tripType = { $regex: tripType, $options: 'i' };
    }

    // Filter by B2B price range
    if (minPrice || maxPrice) {
      query.b2bPrice = {};
      if (minPrice) query.b2bPrice.$gte = Number(minPrice);
      if (maxPrice) query.b2bPrice.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const trips = await AgentTrip.find(query)
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit));

    const total = await AgentTrip.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: trips.length,
      data: {
        trips,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }
);

// @desc    Get single agent trip
// @route   GET /api/v1/agent-trips/:id
// @access  Public (for agents)
export const getAgentTrip = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const trip = await AgentTrip.findById(req.params.id);

    if (!trip) {
      return next(new AppError('Agent trip not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        trip,
      },
    });
  }
);

// @desc    Update agent trip
// @route   PATCH /api/v1/agent-trips/:id
// @access  Private (Admin)
export const updateAgentTrip = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const trip = await AgentTrip.findById(req.params.id);

    if (!trip) {
      return next(new AppError('Agent trip not found', 404));
    }

    const {
      name,
      destination,
      duration,
      description,
      price,
      b2bPrice,
      originalPrice,
      discount,
      commission,
      image,
      inclusions,
      exclusions,
      notes,
      itinerary,
      dates,
      hasGoodies,
      tripCategory,
      tripType,
      isActive,
      occupancyPricing,
    } = req.body;

    // Validate B2B price if both prices are being updated
    if ((price || trip.price) && (b2bPrice || trip.b2bPrice)) {
      const newPrice = price || trip.price;
      const newB2BPrice = b2bPrice || trip.b2bPrice;
      
      if (newB2BPrice >= newPrice) {
        return next(new AppError('B2B price must be less than retail price', 400));
      }
    }

    // Handle image upload if file is provided
    let imageUrl = image;
    if (req.file) {
      // Delete old image from cloudinary if exists
      if (trip.image) {
        await deleteFromCloudinary(trip.image);
      }
      const result = await uploadToCloudinary(req.file.buffer, 'agent-trips');
      imageUrl = result.secure_url;
    }

    // Update fields
    if (name) trip.name = name;
    if (destination) trip.destination = destination;
    if (duration) trip.duration = duration;
    if (description !== undefined) trip.description = description;
    if (price) trip.price = price;
    if (b2bPrice) trip.b2bPrice = b2bPrice;
    if (originalPrice) trip.originalPrice = originalPrice;
    if (discount !== undefined) trip.discount = discount;
    if (commission !== undefined) trip.commission = commission;
    if (imageUrl) trip.image = imageUrl;
    if (inclusions) trip.inclusions = inclusions;
    if (exclusions) trip.exclusions = exclusions;
    if (notes) trip.notes = notes;
    if (itinerary) trip.itinerary = itinerary;
    if (dates) trip.dates = dates;
    if (occupancyPricing) trip.occupancyPricing = occupancyPricing;
    if (hasGoodies !== undefined) trip.hasGoodies = hasGoodies;
    if (tripCategory) trip.tripCategory = tripCategory;
    if (tripType !== undefined) trip.tripType = tripType;
    if (isActive !== undefined) trip.isActive = isActive;

    await trip.save();

    res.status(200).json({
      status: 'success',
      message: 'Agent trip updated successfully',
      data: {
        trip,
      },
    });
  }
);

// @desc    Delete agent trip
// @route   DELETE /api/v1/agent-trips/:id
// @access  Private (Admin)
export const deleteAgentTrip = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const trip = await AgentTrip.findById(req.params.id);

    if (!trip) {
      return next(new AppError('Agent trip not found', 404));
    }

    // Delete image from cloudinary if exists
    if (trip.image) {
      await deleteFromCloudinary(trip.image);
    }

    await trip.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Agent trip deleted successfully',
    });
  }
);

// @desc    Get agent trip statistics
// @route   GET /api/v1/agent-trips/admin/stats
// @access  Private (Admin)
export const getAgentTripStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const totalTrips = await AgentTrip.countDocuments({ isActive: true });
    const inactiveTrips = await AgentTrip.countDocuments({ isActive: false });

    // Average commission
    const avgCommission = await AgentTrip.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, average: { $avg: '$commission' } } },
    ]);

    // Average B2B price
    const avgB2BPrice = await AgentTrip.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, average: { $avg: '$b2bPrice' } } },
    ]);

    // Trips by category
    const tripsByCategory = await AgentTrip.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$tripCategory', count: { $sum: 1 } } },
    ]);

    // Trips by destination (top 10)
    const tripsByDestination = await AgentTrip.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$destination', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Total potential earnings (sum of price - b2bPrice)
    const potentialEarnings = await AgentTrip.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          total: { $sum: { $subtract: ['$price', '$b2bPrice'] } },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalTrips,
        inactiveTrips,
        avgCommission: Math.round(avgCommission[0]?.average || 0),
        avgB2BPrice: Math.round(avgB2BPrice[0]?.average || 0),
        potentialEarnings: potentialEarnings[0]?.total || 0,
        tripsByCategory,
        tripsByDestination,
      },
    });
  }
);

// @desc    Toggle trip active status
// @route   PATCH /api/v1/agent-trips/:id/toggle-active
// @access  Private (Admin)
export const toggleTripActive = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const trip = await AgentTrip.findById(req.params.id);

    if (!trip) {
      return next(new AppError('Agent trip not found', 404));
    }

    trip.isActive = !trip.isActive;
    await trip.save();

    res.status(200).json({
      status: 'success',
      message: `Trip ${trip.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        trip,
      },
    });
  }
);

// @desc    Bulk create agent trips
// @route   POST /api/v1/agent-trips/bulk
// @access  Private (Admin)
export const bulkCreateAgentTrips = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { trips } = req.body;

    if (!trips || !Array.isArray(trips) || trips.length === 0) {
      return next(new AppError('Please provide an array of trips', 400));
    }

    const createdTrips = await AgentTrip.insertMany(trips);

    res.status(201).json({
      status: 'success',
      message: `${createdTrips.length} trips created successfully`,
      data: {
        trips: createdTrips,
      },
    });
  }
);