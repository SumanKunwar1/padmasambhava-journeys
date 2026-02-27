// controllers/agentBooking.controller.ts
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import AgentBooking from '../models/AgentBooking.model';
import AgentTrip from '../models/AgentTrip.model';

// ─── PUBLIC: Agent submits a booking for a client ────────────────────────────
// POST /api/v1/agent-bookings
export const createAgentBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      agentTripId,
      tripName,
      customerName,
      email,
      phone,
      message,
      travelers,
      selectedDate,
      occupancyType,
      selectedPrice,
      totalAmount,
      // Agent info (from JWT if logged in, or from body if sent manually)
      agentName,
      agentEmail,
      agentCompany,
    } = req.body;

    // Validate required fields
    if (!agentTripId || !tripName || !customerName || !email || !phone || !travelers || totalAmount === undefined) {
      return next(new AppError('Please provide all required fields', 400));
    }

    // Verify the agent trip exists (uses AgentTrip model — no 404 anymore!)
    const agentTrip = await AgentTrip.findById(agentTripId);
    if (!agentTrip) {
      return next(new AppError('Agent trip not found', 404));
    }

    // Get agent info from JWT token if available (agent is logged in)
    const agentFromToken = (req as any).agent;

    const booking = await AgentBooking.create({
      agentTripId,
      tripName,
      customerName,
      email,
      phone,
      message: message || '',
      travelers,
      selectedDate: selectedDate || '',
      occupancyType: occupancyType || '',
      selectedPrice: selectedPrice || agentTrip.b2bPrice,
      totalAmount,
      status: 'Pending',
      // Prefer token data over body data for agent identity
      agentId: agentFromToken?._id || undefined,
      agentName: agentFromToken?.fullName || agentName || '',
      agentEmail: agentFromToken?.email || agentEmail || '',
      agentCompany: agentFromToken?.companyName || agentCompany || '',
    });

    res.status(201).json({
      status: 'success',
      message: 'Booking request submitted successfully. We will contact you soon.',
      data: { booking },
    });
  }
);

// ─── ADMIN: Get all agent bookings ───────────────────────────────────────────
// GET /api/v1/agent-bookings
export const getAllAgentBookings = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { status, search, page = 1, limit = 10 } = req.query;

    const query: any = {};

    if (status && status !== 'all' && status !== 'All') {
      query.status = (status as string).charAt(0).toUpperCase() + (status as string).slice(1).toLowerCase();
    }

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { tripName: { $regex: search, $options: 'i' } },
        { bookingId: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { agentName: { $regex: search, $options: 'i' } },
        { agentEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [bookings, total] = await Promise.all([
      AgentBooking.find(query)
        .populate('agentTripId', 'name destination duration image b2bPrice price')
        .populate('agentId', 'fullName companyName email agentId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      AgentBooking.countDocuments(query),
    ]);

    res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: {
        bookings,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }
);

// ─── ADMIN: Stats ─────────────────────────────────────────────────────────────
// GET /api/v1/agent-bookings/stats
export const getAgentBookingStats = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const [totalBookings, confirmedBookings, pendingBookings, cancelledBookings, revenueResult, avgResult] =
      await Promise.all([
        AgentBooking.countDocuments(),
        AgentBooking.countDocuments({ status: 'Confirmed' }),
        AgentBooking.countDocuments({ status: 'Pending' }),
        AgentBooking.countDocuments({ status: 'Cancelled' }),
        AgentBooking.aggregate([
          { $match: { status: 'Confirmed' } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]),
        AgentBooking.aggregate([
          { $group: { _id: null, average: { $avg: '$totalAmount' } } },
        ]),
      ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalBookings,
        confirmedBookings,
        pendingBookings,
        cancelledBookings,
        totalRevenue: revenueResult[0]?.total || 0,
        avgBookingValue: Math.round(avgResult[0]?.average || 0),
      },
    });
  }
);

// ─── ADMIN: Get single booking ────────────────────────────────────────────────
// GET /api/v1/agent-bookings/:id
export const getAgentBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const booking = await AgentBooking.findById(req.params.id)
      .populate('agentTripId')
      .populate('agentId', 'fullName companyName email agentId commissionRate');

    if (!booking) return next(new AppError('Booking not found', 404));

    res.status(200).json({ status: 'success', data: { booking } });
  }
);

// ─── ADMIN: Update booking status ─────────────────────────────────────────────
// PATCH /api/v1/agent-bookings/:id
export const updateAgentBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status } = req.body;
    if (!status) return next(new AppError('Please provide status', 400));

    const booking = await AgentBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!booking) return next(new AppError('Booking not found', 404));

    res.status(200).json({
      status: 'success',
      message: 'Booking updated successfully',
      data: { booking },
    });
  }
);

// ─── ADMIN: Delete booking ────────────────────────────────────────────────────
// DELETE /api/v1/agent-bookings/:id
export const deleteAgentBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const booking = await AgentBooking.findById(req.params.id);
    if (!booking) return next(new AppError('Booking not found', 404));

    await booking.deleteOne();

    res.status(200).json({ status: 'success', message: 'Booking deleted successfully' });
  }
);