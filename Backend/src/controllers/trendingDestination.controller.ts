// controllers/trendingDestination.controller.ts
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import TrendingDestination from '../models/TrendingDestination.model';

// @desc    Create new trending destination
// @route   POST /api/v1/trending-destinations
// @access  Private (Admin)
export const createTrendingDestination = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, price, priceUSD, image, url, order, isActive } = req.body;

    // Validate required fields
    if (!name || price === undefined || !image || !url) {
      return next(new AppError('Please provide all required fields', 400));
    }

    // Validate price
    if (price < 0) {
      return next(new AppError('Price cannot be negative', 400));
    }

    // Create trending destination
    // A blank field means 'convert from the INR price', so an empty string or
    // null must store nothing rather than a zero — a stored 0 would read as a
    // genuine free-of-charge price.
    const optionalPrice = (value: unknown): number | undefined => {
      if (value === undefined || value === null || value === '') return undefined;
      const parsed = Number(value);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
    };

    const trendingDestination = await TrendingDestination.create({
      name,
      price,
      priceUSD: optionalPrice(priceUSD),
      image,
      url,
      order: order || 1,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      status: 'success',
      message: 'Trending destination created successfully',
      data: {
        trendingDestination,
      },
    });
  }
);

// @desc    Get all trending destinations (Admin - includes inactive)
// @route   GET /api/v1/trending-destinations
// @access  Private (Admin)
export const getAllTrendingDestinations = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { active } = req.query;

    const query: any = {};

    // Filter by active status if specified
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    const trendingDestinations = await TrendingDestination.find(query).sort({
      order: 1,
      createdAt: 1,
    });

    res.status(200).json({
      status: 'success',
      results: trendingDestinations.length,
      data: {
        trendingDestinations,
      },
    });
  }
);

// @desc    Get active trending destinations for frontend
// @route   GET /api/v1/trending-destinations/active
// @access  Public
export const getActiveTrendingDestinations = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const trendingDestinations = await TrendingDestination.find({
      isActive: true,
    }).sort({
      order: 1,
    });

    res.status(200).json({
      status: 'success',
      results: trendingDestinations.length,
      data: {
        trendingDestinations,
      },
    });
  }
);

// @desc    Get single trending destination
// @route   GET /api/v1/trending-destinations/:id
// @access  Private (Admin)
export const getTrendingDestination = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const trendingDestination = await TrendingDestination.findById(req.params.id);

    if (!trendingDestination) {
      return next(new AppError('Trending destination not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        trendingDestination,
      },
    });
  }
);

// @desc    Update trending destination
// @route   PATCH /api/v1/trending-destinations/:id
// @access  Private (Admin)
export const updateTrendingDestination = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, price, priceUSD, image, url, order, isActive } = req.body;

    const updateData: any = {};
    const unsetData: any = {};

    // Clearing a manual price has to $unset the field, not write 0 or null —
    // the storefront treats 'absent' as 'convert from INR'.
    const applyOptionalPrice = (field: string, value: unknown) => {
      if (value === undefined) return;
      if (value === null || value === '') {
        unsetData[field] = '';
        return;
      }
      const parsed = Number(value);
      if (Number.isFinite(parsed) && parsed > 0) {
        updateData[field] = parsed;
      } else {
        unsetData[field] = '';
      }
    };

    if (name !== undefined) updateData.name = name;
    if (price !== undefined) {
      if (price < 0) {
        return next(new AppError('Price cannot be negative', 400));
      }
      updateData.price = price;
    }
    applyOptionalPrice('priceUSD', priceUSD);
    if (image !== undefined) updateData.image = image;
    if (url !== undefined) updateData.url = url;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const trendingDestination = await TrendingDestination.findByIdAndUpdate(
      req.params.id,
      {
        ...(Object.keys(updateData).length ? { $set: updateData } : {}),
        ...(Object.keys(unsetData).length ? { $unset: unsetData } : {}),
      },
      { new: true, runValidators: true }
    );

    if (!trendingDestination) {
      return next(new AppError('Trending destination not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Trending destination updated successfully',
      data: {
        trendingDestination,
      },
    });
  }
);

// @desc    Toggle trending destination active status
// @route   PATCH /api/v1/trending-destinations/:id/toggle-active
// @access  Private (Admin)
export const toggleTrendingDestinationActive = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const trendingDestination = await TrendingDestination.findById(req.params.id);

    if (!trendingDestination) {
      return next(new AppError('Trending destination not found', 404));
    }

    trendingDestination.isActive = !trendingDestination.isActive;
    await trendingDestination.save();

    res.status(200).json({
      status: 'success',
      message: `Trending destination ${
        trendingDestination.isActive ? 'activated' : 'deactivated'
      } successfully`,
      data: {
        trendingDestination,
      },
    });
  }
);

// @desc    Delete trending destination
// @route   DELETE /api/v1/trending-destinations/:id
// @access  Private (Admin)
export const deleteTrendingDestination = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const trendingDestination = await TrendingDestination.findById(req.params.id);

    if (!trendingDestination) {
      return next(new AppError('Trending destination not found', 404));
    }

    const deletedOrder = trendingDestination.order;

    await trendingDestination.deleteOne();

    // Reorder remaining destinations
    await TrendingDestination.updateMany(
      { order: { $gt: deletedOrder } },
      { $inc: { order: -1 } }
    );

    res.status(200).json({
      status: 'success',
      message: 'Trending destination deleted successfully',
    });
  }
);

// @desc    Reorder trending destinations
// @route   PATCH /api/v1/trending-destinations/reorder
// @access  Private (Admin)
export const reorderTrendingDestinations = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { destinationIds } = req.body;

    if (!destinationIds || !Array.isArray(destinationIds)) {
      return next(new AppError('Please provide an array of destination IDs', 400));
    }

    // Update order for each destination
    const updatePromises = destinationIds.map((id: string, index: number) =>
      TrendingDestination.findByIdAndUpdate(id, { order: index + 1 })
    );

    await Promise.all(updatePromises);

    const trendingDestinations = await TrendingDestination.find().sort({ order: 1 });

    res.status(200).json({
      status: 'success',
      message: 'Trending destinations reordered successfully',
      data: {
        trendingDestinations,
      },
    });
  }
);

// @desc    Get trending destination statistics
// @route   GET /api/v1/trending-destinations/admin/stats
// @access  Private (Admin)
export const getTrendingDestinationStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const totalDestinations = await TrendingDestination.countDocuments();
    const activeDestinations = await TrendingDestination.countDocuments({
      isActive: true,
    });
    const inactiveDestinations = await TrendingDestination.countDocuments({
      isActive: false,
    });

    // Calculate average price
    const avgPriceResult = await TrendingDestination.aggregate([
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ]);

    const priceStats = avgPriceResult.length > 0 ? avgPriceResult[0] : {
      avgPrice: 0,
      minPrice: 0,
      maxPrice: 0,
    };

    res.status(200).json({
      status: 'success',
      data: {
        totalDestinations,
        activeDestinations,
        inactiveDestinations,
        priceStats: {
          average: Math.round(priceStats.avgPrice || 0),
          minimum: priceStats.minPrice || 0,
          maximum: priceStats.maxPrice || 0,
        },
      },
    });
  }
);