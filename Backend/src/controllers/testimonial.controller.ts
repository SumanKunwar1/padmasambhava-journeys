// controllers/testimonial.controller.ts
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import Testimonial from '../models/Testimonial.model';

// @desc    Create new testimonial
// @route   POST /api/v1/testimonials
// @access  Private (Admin)
export const createTestimonial = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, trip, rating, review, image, isActive, featured } = req.body;

    // Validate required fields
    if (!name || !trip || !rating || !review || !image) {
      return next(new AppError('Please provide all required fields', 400));
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return next(new AppError('Rating must be between 1 and 5', 400));
    }

    // Create testimonial
    const testimonial = await Testimonial.create({
      name,
      trip,
      rating,
      review,
      image,
      isActive: isActive !== undefined ? isActive : true,
      featured: featured || false,
      createdBy: (req as any).user._id,
    });

    res.status(201).json({
      status: 'success',
      message: 'Testimonial created successfully',
      data: {
        testimonial,
      },
    });
  }
);

// @desc    Get all testimonials (with filtering)
// @route   GET /api/v1/testimonials
// @access  Public/Private
export const getAllTestimonials = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { 
      isActive, 
      featured, 
      search, 
      page = 1, 
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query: any = {};

    // Filter by active status (for public API, only show active)
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    } else if (!(req as any).user) {
      // Public access - only show active testimonials
      query.isActive = true;
    }

    // Filter by featured
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { trip: { $regex: search, $options: 'i' } },
        { review: { $regex: search, $options: 'i' } },
        { testimonialId: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === 'desc' ? -1 : 1;
    const sortField = sortBy as string;

    const testimonials = await Testimonial.find(query)
      .populate('createdBy', 'name email')
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(Number(limit));

    const total = await Testimonial.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: testimonials.length,
      data: {
        testimonials,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }
);

// @desc    Get public testimonials (active only)
// @route   GET /api/v1/testimonials/public
// @access  Public
export const getPublicTestimonials = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { featured, limit = 20 } = req.query;

    const query: any = { isActive: true };

    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    const testimonials = await Testimonial.find(query)
      .select('-createdBy -__v')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json({
      status: 'success',
      results: testimonials.length,
      data: {
        testimonials,
      },
    });
  }
);

// @desc    Get single testimonial
// @route   GET /api/v1/testimonials/:id
// @access  Private (Admin)
export const getTestimonial = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const testimonial = await Testimonial.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );

    if (!testimonial) {
      return next(new AppError('Testimonial not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        testimonial,
      },
    });
  }
);

// @desc    Update testimonial
// @route   PATCH /api/v1/testimonials/:id
// @access  Private (Admin)
export const updateTestimonial = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, trip, rating, review, image, isActive, featured } = req.body;

    const updateData: any = {};

    // Only add fields that are provided
    if (name) updateData.name = name;
    if (trip) updateData.trip = trip;
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return next(new AppError('Rating must be between 1 and 5', 400));
      }
      updateData.rating = rating;
    }
    if (review) updateData.review = review;
    if (image) updateData.image = image;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (featured !== undefined) updateData.featured = featured;

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!testimonial) {
      return next(new AppError('Testimonial not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Testimonial updated successfully',
      data: {
        testimonial,
      },
    });
  }
);

// @desc    Delete testimonial
// @route   DELETE /api/v1/testimonials/:id
// @access  Private (Admin)
export const deleteTestimonial = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return next(new AppError('Testimonial not found', 404));
    }

    await testimonial.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Testimonial deleted successfully',
    });
  }
);

// @desc    Toggle testimonial active status
// @route   PATCH /api/v1/testimonials/:id/toggle-active
// @access  Private (Admin)
export const toggleActive = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return next(new AppError('Testimonial not found', 404));
    }

    testimonial.isActive = !testimonial.isActive;
    await testimonial.save();

    res.status(200).json({
      status: 'success',
      message: `Testimonial ${testimonial.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        testimonial,
      },
    });
  }
);

// @desc    Toggle testimonial featured status
// @route   PATCH /api/v1/testimonials/:id/toggle-featured
// @access  Private (Admin)
export const toggleFeatured = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return next(new AppError('Testimonial not found', 404));
    }

    testimonial.featured = !testimonial.featured;
    await testimonial.save();

    res.status(200).json({
      status: 'success',
      message: `Testimonial ${testimonial.featured ? 'featured' : 'unfeatured'} successfully`,
      data: {
        testimonial,
      },
    });
  }
);

// @desc    Get testimonial statistics
// @route   GET /api/v1/testimonials/admin/stats
// @access  Private (Admin)
export const getTestimonialStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const totalTestimonials = await Testimonial.countDocuments();
    const activeTestimonials = await Testimonial.countDocuments({ isActive: true });
    const inactiveTestimonials = await Testimonial.countDocuments({ isActive: false });
    const featuredTestimonials = await Testimonial.countDocuments({ 
      featured: true, 
      isActive: true 
    });

    // Average rating
    const ratingStats = await Testimonial.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    // Rating distribution
    const ratingDistribution = await Testimonial.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    // Recent testimonials
    const recentTestimonials = await Testimonial.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name trip rating createdAt isActive');

    res.status(200).json({
      status: 'success',
      data: {
        totalTestimonials,
        activeTestimonials,
        inactiveTestimonials,
        featuredTestimonials,
        averageRating: ratingStats[0]?.averageRating?.toFixed(1) || 0,
        totalRatings: ratingStats[0]?.totalRatings || 0,
        ratingDistribution,
        recentTestimonials,
      },
    });
  }
);