// controllers/exploreDestination.controller.ts
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import ExploreDestination from '../models/ExploreDestination.model';

// @desc    Create new explore destination
// @route   POST /api/v1/explore-destinations
// @access  Private (Admin)
export const createExploreDestination = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, image, type, url, order, isActive } = req.body;

    // Validate required fields (url is optional - cards link by slug now)
    if (!name || !image || !type) {
      return next(new AppError('Please provide all required fields', 400));
    }

    // Validate type
    if (!['international', 'domestic', 'weekend', 'Retreats & Healing'].includes(type)) {
      return next(new AppError('Invalid destination type', 400));
    }

    // Create explore destination
    const exploreDestination = await ExploreDestination.create({
      name,
      image,
      type,
      url: url || '',
      order: order || 1,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      status: 'success',
      message: 'Explore destination created successfully',
      data: {
        exploreDestination,
      },
    });
  }
);

// @desc    Get all explore destinations
// @route   GET /api/v1/explore-destinations
// @access  Public
export const getAllExploreDestinations = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type, active } = req.query;

    const query: any = {};

    // Filter by type if specified
    if (type && ['international', 'domestic', 'weekend', 'Retreats & Healing'].includes(type as string)) {
      query.type = type;
    }

    // Filter by active status if specified
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    const exploreDestinations = await ExploreDestination.find(query).sort({
      order: 1,
      createdAt: 1,
    });

    res.status(200).json({
      status: 'success',
      results: exploreDestinations.length,
      data: {
        exploreDestinations,
      },
    });
  }
);

// @desc    Get active explore destinations for frontend
// @route   GET /api/v1/explore-destinations/active
// @access  Public
export const getActiveExploreDestinations = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { type } = req.query;

    const query: any = { isActive: true };

    // Filter by type if specified
    if (type && ['international', 'domestic', 'weekend', 'Retreats & Healing'].includes(type as string)) {
      query.type = type;
    }

    const exploreDestinations = await ExploreDestination.find(query).sort({
      order: 1,
    });

    res.status(200).json({
      status: 'success',
      results: exploreDestinations.length,
      data: {
        exploreDestinations,
      },
    });
  }
);

// @desc    Get single explore destination by slug (for /destination/:slug pages)
// @route   GET /api/v1/explore-destinations/slug/:slug
// @access  Public
export const getExploreDestinationBySlug = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const exploreDestination = await ExploreDestination.findOne({
      slug: String(req.params.slug).toLowerCase().trim(),
      isActive: true,
    });

    if (!exploreDestination) {
      return next(new AppError('Explore destination not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        exploreDestination,
      },
    });
  }
);

// @desc    Get single explore destination
// @route   GET /api/v1/explore-destinations/:id
// @access  Private (Admin)
export const getExploreDestination = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const exploreDestination = await ExploreDestination.findById(req.params.id);

    if (!exploreDestination) {
      return next(new AppError('Explore destination not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        exploreDestination,
      },
    });
  }
);

// @desc    Update explore destination
// @route   PATCH /api/v1/explore-destinations/:id
// @access  Private (Admin)
export const updateExploreDestination = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, image, type, url, order, isActive } = req.body;

    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;
    if (type !== undefined) {
      if (!['international', 'domestic', 'weekend', 'Retreats & Healing'].includes(type)) {
        return next(new AppError('Invalid destination type', 400));
      }
      updateData.type = type;
    }
    if (url !== undefined) updateData.url = url;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const exploreDestination = await ExploreDestination.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!exploreDestination) {
      return next(new AppError('Explore destination not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Explore destination updated successfully',
      data: {
        exploreDestination,
      },
    });
  }
);

// @desc    Toggle explore destination active status
// @route   PATCH /api/v1/explore-destinations/:id/toggle-active
// @access  Private (Admin)
export const toggleExploreDestinationActive = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const exploreDestination = await ExploreDestination.findById(req.params.id);

    if (!exploreDestination) {
      return next(new AppError('Explore destination not found', 404));
    }

    exploreDestination.isActive = !exploreDestination.isActive;
    await exploreDestination.save();

    res.status(200).json({
      status: 'success',
      message: `Explore destination ${
        exploreDestination.isActive ? 'activated' : 'deactivated'
      } successfully`,
      data: {
        exploreDestination,
      },
    });
  }
);

// @desc    Delete explore destination
// @route   DELETE /api/v1/explore-destinations/:id
// @access  Private (Admin)
export const deleteExploreDestination = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const exploreDestination = await ExploreDestination.findById(req.params.id);

    if (!exploreDestination) {
      return next(new AppError('Explore destination not found', 404));
    }

    const deletedType = exploreDestination.type;
    const deletedOrder = exploreDestination.order;

    await exploreDestination.deleteOne();

    // Reorder remaining destinations of same type
    await ExploreDestination.updateMany(
      { type: deletedType, order: { $gt: deletedOrder } },
      { $inc: { order: -1 } }
    );

    res.status(200).json({
      status: 'success',
      message: 'Explore destination deleted successfully',
    });
  }
);

// @desc    Reorder explore destinations
// @route   PATCH /api/v1/explore-destinations/reorder
// @access  Private (Admin)
export const reorderExploreDestinations = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { destinationIds } = req.body;

    if (!destinationIds || !Array.isArray(destinationIds)) {
      return next(new AppError('Please provide an array of destination IDs', 400));
    }

    // Update order for each destination
    const updatePromises = destinationIds.map((id: string, index: number) =>
      ExploreDestination.findByIdAndUpdate(id, { order: index + 1 })
    );

    await Promise.all(updatePromises);

    const exploreDestinations = await ExploreDestination.find().sort({ order: 1 });

    res.status(200).json({
      status: 'success',
      message: 'Explore destinations reordered successfully',
      data: {
        exploreDestinations,
      },
    });
  }
);

// @desc    Get explore destination statistics
// @route   GET /api/v1/explore-destinations/admin/stats
// @access  Private (Admin)
export const getExploreDestinationStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const totalDestinations = await ExploreDestination.countDocuments();
    const activeDestinations = await ExploreDestination.countDocuments({
      isActive: true,
    });
    const inactiveDestinations = await ExploreDestination.countDocuments({
      isActive: false,
    });

    // Count by type
    const internationalCount = await ExploreDestination.countDocuments({
      type: 'international',
      isActive: true,
    });
    const domesticCount = await ExploreDestination.countDocuments({
      type: 'domestic',
      isActive: true,
    });
    const weekendCount = await ExploreDestination.countDocuments({
      type: 'weekend',
      isActive: true,
    });
    const retreatsCount = await ExploreDestination.countDocuments({
      type: 'Retreats & Healing',
      isActive: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        totalDestinations,
        activeDestinations,
        inactiveDestinations,
        byType: {
          international: internationalCount,
          domestic: domesticCount,
          weekend: weekendCount,
          retreats: retreatsCount,
        },
      },
    });
  }
);