// controllers/heroImage.controller.ts
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import HeroImage from '../models/HeroImage.model';

// @desc    Create new hero image
// @route   POST /api/v1/hero-images
// @access  Private (Admin)
export const createHeroImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { imageUrl, title, subtitle, order, isActive } = req.body;

    // Validate required fields
    if (!imageUrl) {
      return next(new AppError('Please provide an image URL', 400));
    }

    // Create hero image
    const heroImage = await HeroImage.create({
      imageUrl,
      title: title || '',
      subtitle: subtitle || '',
      order: order || 1,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      status: 'success',
      message: 'Hero image created successfully',
      data: {
        heroImage,
      },
    });
  }
);

// @desc    Get all hero images
// @route   GET /api/v1/hero-images
// @access  Public
export const getAllHeroImages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { active } = req.query;

    const query: any = {};

    // Filter by active status if specified
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    const heroImages = await HeroImage.find(query).sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      status: 'success',
      results: heroImages.length,
      data: {
        heroImages,
      },
    });
  }
);

// @desc    Get active hero images for frontend
// @route   GET /api/v1/hero-images/active
// @access  Public
export const getActiveHeroImages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const heroImages = await HeroImage.find({ isActive: true }).sort({ order: 1 });

    res.status(200).json({
      status: 'success',
      results: heroImages.length,
      data: {
        heroImages,
      },
    });
  }
);

// @desc    Get single hero image
// @route   GET /api/v1/hero-images/:id
// @access  Private (Admin)
export const getHeroImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const heroImage = await HeroImage.findById(req.params.id);

    if (!heroImage) {
      return next(new AppError('Hero image not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        heroImage,
      },
    });
  }
);

// @desc    Update hero image
// @route   PATCH /api/v1/hero-images/:id
// @access  Private (Admin)
export const updateHeroImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { imageUrl, title, subtitle, order, isActive } = req.body;

    const updateData: any = {};

    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;

    const heroImage = await HeroImage.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!heroImage) {
      return next(new AppError('Hero image not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Hero image updated successfully',
      data: {
        heroImage,
      },
    });
  }
);

// @desc    Toggle hero image active status
// @route   PATCH /api/v1/hero-images/:id/toggle-active
// @access  Private (Admin)
export const toggleHeroImageActive = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const heroImage = await HeroImage.findById(req.params.id);

    if (!heroImage) {
      return next(new AppError('Hero image not found', 404));
    }

    heroImage.isActive = !heroImage.isActive;
    await heroImage.save();

    res.status(200).json({
      status: 'success',
      message: `Hero image ${heroImage.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        heroImage,
      },
    });
  }
);

// @desc    Delete hero image
// @route   DELETE /api/v1/hero-images/:id
// @access  Private (Admin)
export const deleteHeroImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const heroImage = await HeroImage.findById(req.params.id);

    if (!heroImage) {
      return next(new AppError('Hero image not found', 404));
    }

    await heroImage.deleteOne();

    // Reorder remaining images
    await HeroImage.updateMany(
      { order: { $gt: heroImage.order } },
      { $inc: { order: -1 } }
    );

    res.status(200).json({
      status: 'success',
      message: 'Hero image deleted successfully',
    });
  }
);

// @desc    Reorder hero images
// @route   PATCH /api/v1/hero-images/reorder
// @access  Private (Admin)
export const reorderHeroImages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { imageIds } = req.body;

    if (!imageIds || !Array.isArray(imageIds)) {
      return next(new AppError('Please provide an array of image IDs', 400));
    }

    // Update order for each image
    const updatePromises = imageIds.map((id: string, index: number) =>
      HeroImage.findByIdAndUpdate(id, { order: index + 1 })
    );

    await Promise.all(updatePromises);

    const heroImages = await HeroImage.find().sort({ order: 1 });

    res.status(200).json({
      status: 'success',
      message: 'Hero images reordered successfully',
      data: {
        heroImages,
      },
    });
  }
);

// @desc    Get hero image statistics
// @route   GET /api/v1/hero-images/admin/stats
// @access  Private (Admin)
export const getHeroImageStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const totalImages = await HeroImage.countDocuments();
    const activeImages = await HeroImage.countDocuments({ isActive: true });
    const inactiveImages = await HeroImage.countDocuments({ isActive: false });

    res.status(200).json({
      status: 'success',
      data: {
        totalImages,
        activeImages,
        inactiveImages,
      },
    });
  }
);