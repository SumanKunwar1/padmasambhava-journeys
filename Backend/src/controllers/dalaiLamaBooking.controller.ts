// controllers/dalaiLamaBooking.controller.ts
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import DalaiLamaBooking from '../models/DalaiLamaBooking.model';

// @desc    Create new Dalai Lama booking
// @route   POST /api/v1/dalai-lama-bookings
// @access  Public
export const createDalaiLamaBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { 
      customerName, 
      email, 
      phone, 
      message, 
      travelers, 
      selectedDate, 
      totalAmount 
    } = req.body;

    // Validate required fields
    if (!customerName || !email || !phone || !travelers || !selectedDate || totalAmount === undefined) {
      return next(new AppError('Please provide all required fields', 400));
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(new AppError('Please provide a valid email address', 400));
    }

    // Create booking
    const booking = await DalaiLamaBooking.create({
      customerName,
      email,
      phone,
      message: message || '',
      travelers,
      selectedDate,
      totalAmount,
    });

    res.status(201).json({
      status: 'success',
      message: 'Dalai Lama Darshan booking request submitted successfully. We will contact you soon.',
      data: {
        booking,
      },
    });
  }
);

// @desc    Get all Dalai Lama bookings
// @route   GET /api/v1/dalai-lama-bookings
// @access  Private (Admin)
export const getAllDalaiLamaBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status, search, page = 1, limit = 10 } = req.query;

    const result = await DalaiLamaBooking.findAll({
      status: status as string,
      search: search as string,
      page: Number(page),
      limit: Number(limit),
    });

    res.status(200).json({
      status: 'success',
      results: result.bookings.length,
      data: {
        bookings: result.bookings,
        pagination: {
          total: result.total,
          page: Number(page),
          pages: result.pages,
        },
      },
    });
  }
);

// @desc    Get single Dalai Lama booking
// @route   GET /api/v1/dalai-lama-bookings/:id
// @access  Private (Admin)
export const getDalaiLamaBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const booking = await DalaiLamaBooking.findById(req.params.id);

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        booking,
      },
    });
  }
);

// @desc    Update Dalai Lama booking status
// @route   PATCH /api/v1/dalai-lama-bookings/:id
// @access  Private (Admin)
export const updateDalaiLamaBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.body;

    if (!status) {
      return next(new AppError('Please provide status', 400));
    }

    const validStatuses = ['Pending', 'Confirmed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return next(new AppError('Invalid status value', 400));
    }

    const booking = await DalaiLamaBooking.findByIdAndUpdate(
      req.params.id,
      { status }
    );

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Booking updated successfully',
      data: {
        booking,
      },
    });
  }
);

// @desc    Delete Dalai Lama booking
// @route   DELETE /api/v1/dalai-lama-bookings/:id
// @access  Private (Admin)
export const deleteDalaiLamaBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deleted = await DalaiLamaBooking.deleteOne(req.params.id);

    if (!deleted) {
      return next(new AppError('Booking not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Booking deleted successfully',
    });
  }
);

// @desc    Get Dalai Lama booking statistics
// @route   GET /api/v1/dalai-lama-bookings/admin/stats
// @access  Private (Admin)
export const getDalaiLamaBookingStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const stats = await DalaiLamaBooking.getStats();

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  }
);