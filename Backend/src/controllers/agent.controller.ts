// controllers/agent.controller.ts
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import Agent from '../models/Agent.model';

// @desc    Create new agent application
// @route   POST /api/v1/agents
// @access  Public
export const createAgent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      fullName,
      companyName,
      email,
      phone,
      city,
      state,
      website,
      experience,
    } = req.body;

    // Validate required fields
    if (!fullName || !companyName || !email || !phone || !city || !state || !experience) {
      return next(new AppError('Please provide all required fields', 400));
    }

    // Check if email already exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return next(new AppError('An application with this email already exists', 400));
    }

    // Create agent application
    const agent = await Agent.create({
      fullName,
      companyName,
      email,
      phone,
      city,
      state,
      website: website || '',
      experience,
      status: 'Pending',
    });

    res.status(201).json({
      status: 'success',
      message: 'Application submitted successfully. We will contact you within 24-48 hours.',
      data: {
        agent,
      },
    });
  }
);

// @desc    Get all agents
// @route   GET /api/v1/agents
// @access  Private (Admin)
export const getAllAgents = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { status, search, page = 1, limit = 10 } = req.query;

    const query: any = {};

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { agentId: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const agents = await Agent.find(query)
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Agent.countDocuments(query);

    res.status(200).json({
      status: 'success',
      results: agents.length,
      data: {
        agents,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }
);

// @desc    Get single agent
// @route   GET /api/v1/agents/:id
// @access  Private (Admin)
export const getAgent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const agent = await Agent.findById(req.params.id).populate('approvedBy', 'name email');

    if (!agent) {
      return next(new AppError('Agent not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        agent,
      },
    });
  }
);

// @desc    Update agent
// @route   PATCH /api/v1/agents/:id
// @access  Private (Admin)
export const updateAgent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      status,
      commissionRate,
      isActive,
      notes,
      fullName,
      companyName,
      phone,
      city,
      state,
      website,
    } = req.body;

    const updateData: any = {};

    // Only add fields that are provided
    if (status) updateData.status = status;
    if (commissionRate !== undefined) updateData.commissionRate = commissionRate;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (notes !== undefined) updateData.notes = notes;
    if (fullName) updateData.fullName = fullName;
    if (companyName) updateData.companyName = companyName;
    if (phone) updateData.phone = phone;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (website !== undefined) updateData.website = website;

    // If status is being approved, add approval metadata
    if (status === 'Approved') {
      updateData.approvedBy = (req as any).user._id;
      updateData.approvedAt = new Date();
    }

    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('approvedBy', 'name email');

    if (!agent) {
      return next(new AppError('Agent not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Agent updated successfully',
      data: {
        agent,
      },
    });
  }
);

// @desc    Delete agent
// @route   DELETE /api/v1/agents/:id
// @access  Private (Admin)
export const deleteAgent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return next(new AppError('Agent not found', 404));
    }

    await agent.deleteOne();

    res.status(200).json({
      status: 'success',
      message: 'Agent deleted successfully',
    });
  }
);

// @desc    Get agent statistics
// @route   GET /api/v1/agents/admin/stats
// @access  Private (Admin)
export const getAgentStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const totalAgents = await Agent.countDocuments();
    const pendingAgents = await Agent.countDocuments({ status: 'Pending' });
    const approvedAgents = await Agent.countDocuments({ status: 'Approved' });
    const rejectedAgents = await Agent.countDocuments({ status: 'Rejected' });
    const activeAgents = await Agent.countDocuments({ status: 'Approved', isActive: true });

    const totalRevenue = await Agent.aggregate([
      { $match: { status: 'Approved' } },
      { $group: { _id: null, total: { $sum: '$totalRevenue' } } },
    ]);

    const totalBookings = await Agent.aggregate([
      { $match: { status: 'Approved' } },
      { $group: { _id: null, total: { $sum: '$totalBookings' } } },
    ]);

    const avgCommissionRate = await Agent.aggregate([
      { $match: { status: 'Approved' } },
      { $group: { _id: null, average: { $avg: '$commissionRate' } } },
    ]);

    // Top performing agents
    const topAgents = await Agent.find({ status: 'Approved' })
      .sort({ totalRevenue: -1 })
      .limit(5)
      .select('fullName companyName totalRevenue totalBookings commissionRate');

    res.status(200).json({
      status: 'success',
      data: {
        totalAgents,
        pendingAgents,
        approvedAgents,
        rejectedAgents,
        activeAgents,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalBookings: totalBookings[0]?.total || 0,
        avgCommissionRate: Math.round(avgCommissionRate[0]?.average || 0),
        topAgents,
      },
    });
  }
);

// @desc    Approve agent
// @route   PATCH /api/v1/agents/:id/approve
// @access  Private (Admin)
export const approveAgent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commissionRate } = req.body;

    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Approved',
        approvedBy: (req as any).user._id,
        approvedAt: new Date(),
        commissionRate: commissionRate || 10,
        isActive: true,
      },
      { new: true, runValidators: true }
    );

    if (!agent) {
      return next(new AppError('Agent not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Agent approved successfully',
      data: {
        agent,
      },
    });
  }
);

// @desc    Reject agent
// @route   PATCH /api/v1/agents/:id/reject
// @access  Private (Admin)
export const rejectAgent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { notes } = req.body;

    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      {
        status: 'Rejected',
        notes: notes || '',
        isActive: false,
      },
      { new: true, runValidators: true }
    );

    if (!agent) {
      return next(new AppError('Agent not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Agent rejected',
      data: {
        agent,
      },
    });
  }
);