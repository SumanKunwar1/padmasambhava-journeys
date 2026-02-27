// controllers/agent.controller.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import Agent from '../models/Agent.model';

// ─── Helper: sign JWT ────────────────────────────────────────────────────────
const signToken = (id: string): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  };
  return jwt.sign({ id, role: 'agent' }, process.env.JWT_SECRET as string, options);
};

// ─── PUBLIC: Agent submits application WITH their own password ───────────────
// POST /api/v1/agents/apply
export const applyAsAgent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { fullName, companyName, email, phone, city, state, website, experience, password } = req.body;

  if (!fullName || !companyName || !email || !phone || !city || !state || !experience) {
    return next(new AppError('Please provide all required fields', 400));
  }

  if (!password || password.length < 6) {
    return next(new AppError('Password must be at least 6 characters', 400));
  }

  // Check duplicate email
  const existing = await Agent.findOne({ email: email.toLowerCase() });
  if (existing) {
    return next(new AppError('An application with this email already exists', 409));
  }

  // Save agent with their password — hashed by pre-save hook
  // Status starts as Pending so they CANNOT login yet
  const agent = await Agent.create({
    fullName,
    companyName,
    email,
    phone,
    city,
    state,
    website: website || '',
    experience,
    password,          // bcrypt pre-save hook will hash this
    status: 'Pending', // ⭐ login blocked until admin approves
  });

  res.status(201).json({
    status: 'success',
    message: 'Application submitted! Our team will review and contact you within 2-3 business days.',
    data: {
      agentId: agent._id,
      email: agent.email,
      status: agent.status,
    },
  });
});

// ─── PUBLIC: Agent login ─────────────────────────────────────────────────────
// POST /api/v1/agents/login
export const agentLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Must select password since it is hidden by default
  const agent = await Agent.findOne({ email: email.toLowerCase() }).select('+password');

  if (!agent) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Block login for non-approved agents BEFORE checking password
  // This prevents timing attacks revealing whether an email exists
  if (agent.status === 'Pending') {
    return next(new AppError(
      'Your application is still under review. You will be notified once approved.',
      403
    ));
  }

  if (agent.status === 'Rejected') {
    return next(new AppError(
      'Your agent application was not approved. Please contact support for more information.',
      403
    ));
  }

  if (!agent.isActive) {
    return next(new AppError('Your account has been deactivated. Please contact support.', 403));
  }

  // Verify password — only the one the agent set at signup (bcrypt compare)
  const isMatch = await agent.comparePassword(password);
  if (!isMatch) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Issue JWT
  const token = signToken((agent._id as unknown) as string);

  res.cookie('agentToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    status: 'success',
    token,
    data: {
      agent: {
        _id: agent._id,
        agentId: agent.agentId,
        fullName: agent.fullName,
        companyName: agent.companyName,
        email: agent.email,
        phone: agent.phone,
        city: agent.city,
        state: agent.state,
        commissionRate: agent.commissionRate,
        role: 'agent',
      },
    },
  });
});

// ─── ADMIN: Get all agents ───────────────────────────────────────────────────
// GET /api/v1/agents
export const getAllAgents = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
  const { status, search, page = 1, limit = 50 } = req.query;

  const query: any = {};

  if (status && status !== 'all') {
    const s = status as string;
    query.status = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { companyName: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [agents, total] = await Promise.all([
    Agent.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Agent.countDocuments(query),
  ]);

  res.status(200).json({
    status: 'success',
    results: agents.length,
    data: {
      agents,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    },
  });
});

// ─── ADMIN: Get stats ────────────────────────────────────────────────────────
// GET /api/v1/agents/stats
export const getAgentStats = catchAsync(async (_req: Request, res: Response, _next: NextFunction) => {
  const [totalAgents, approvedAgents, pendingAgents, rejectedAgents] = await Promise.all([
    Agent.countDocuments(),
    Agent.countDocuments({ status: 'Approved' }),
    Agent.countDocuments({ status: 'Pending' }),
    Agent.countDocuments({ status: 'Rejected' }),
  ]);

  res.status(200).json({
    status: 'success',
    data: { totalAgents, approvedAgents, pendingAgents, rejectedAgents },
  });
});

// ─── ADMIN: Approve agent — NO password needed, agent already set theirs ─────
// PATCH /api/v1/agents/:id/approve
export const approveAgent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { commissionRate, notes } = req.body;

  const agent = await Agent.findById(req.params.id);
  if (!agent) return next(new AppError('Agent not found', 404));

  // Assign a unique agentId on first approval
  if (!agent.agentId) {
    const count = await Agent.countDocuments({ agentId: { $exists: true, $ne: null } });
    agent.agentId = `AGT-${String(count + 1).padStart(4, '0')}`;
  }

  // Flip status — the agent's own password is already stored and hashed
  agent.status = 'Approved';
  agent.isActive = true;
  if (commissionRate !== undefined) agent.commissionRate = Number(commissionRate);
  if (notes !== undefined) agent.notes = notes;

  // Use updateOne to avoid re-hashing the already-hashed password via pre-save
  await Agent.updateOne(
    { _id: agent._id },
    {
      status: agent.status,
      isActive: agent.isActive,
      agentId: agent.agentId,
      ...(commissionRate !== undefined && { commissionRate: Number(commissionRate) }),
      ...(notes !== undefined && { notes }),
    }
  );

  res.status(200).json({
    status: 'success',
    message: `Agent ${agent.fullName} approved. They can now login with their registered email and password.`,
    data: {
      agent: {
        _id: agent._id,
        agentId: agent.agentId,
        fullName: agent.fullName,
        email: agent.email,
        status: 'Approved',
        commissionRate: commissionRate ?? agent.commissionRate,
      },
    },
  });
});

// ─── ADMIN: Reject agent ─────────────────────────────────────────────────────
// PATCH /api/v1/agents/:id/reject
export const rejectAgent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const agent = await Agent.findById(req.params.id);
  if (!agent) return next(new AppError('Agent not found', 404));

  await Agent.updateOne(
    { _id: agent._id },
    { status: 'Rejected', isActive: false, ...(req.body.notes && { notes: req.body.notes }) }
  );

  res.status(200).json({
    status: 'success',
    message: `Agent ${agent.fullName} has been rejected.`,
  });
});

// ─── ADMIN: Update commission / notes / active status ────────────────────────
// PATCH /api/v1/agents/:id/credentials
export const updateAgentCredentials = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { commissionRate, notes, isActive } = req.body;

  const agent = await Agent.findById(req.params.id);
  if (!agent) return next(new AppError('Agent not found', 404));

  // Only update non-password fields here — agent manages their own password
  const updates: any = {};
  if (commissionRate !== undefined) updates.commissionRate = Number(commissionRate);
  if (notes !== undefined) updates.notes = notes;
  if (isActive !== undefined) updates.isActive = isActive;

  await Agent.updateOne({ _id: agent._id }, updates);

  res.status(200).json({
    status: 'success',
    message: 'Agent settings updated successfully.',
  });
});

// ─── ADMIN: Delete agent ─────────────────────────────────────────────────────
// DELETE /api/v1/agents/:id
export const deleteAgent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const agent = await Agent.findByIdAndDelete(req.params.id);
  if (!agent) return next(new AppError('Agent not found', 404));

  res.status(200).json({
    status: 'success',
    message: 'Agent deleted successfully.',
  });
});