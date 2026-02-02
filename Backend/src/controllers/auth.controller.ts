// controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import Admin, { IAdmin } from '../models/Admin.model';
import { config } from '../config/env';

// Interface for JWT payload
interface IJWTPayload {
  id: string;
  iat?: number;
  exp?: number;
}

// Create JWT token - using synchronous version to avoid type issues
const signToken = (id: string): string => {
  return jwt.sign(
    { id } as IJWTPayload,
    config.jwtSecret as string,
    { expiresIn: config.jwtExpiresIn } as jwt.SignOptions
  ) as string;
};

// Send token response
const createSendToken = (admin: any, statusCode: number, res: Response): void => {
  const token = signToken(admin._id.toString());

  // FIXED: Production-ready cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() + config.jwtCookieExpiresIn * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: config.nodeEnv === 'production', // HTTPS only in production
    sameSite: config.nodeEnv === 'production' ? 'none' as const : 'lax' as const, // CRITICAL: 'none' for cross-origin in production
    domain: config.nodeEnv === 'production' ? '.padmasambhavatrip.com' : undefined, // Allow subdomain cookies
  };

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  const adminObj = admin.toObject();
  delete adminObj.password;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      admin: adminObj,
    },
  });
};

// @desc    Login admin
// @route   POST /api/v1/auth/login
// @access  Public
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // 2) Check if admin exists && password is correct
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin || !(await admin.comparePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) Check if admin is active
    if (!admin.isActive) {
      return next(new AppError('Your account has been deactivated', 403));
    }

    // 4) If everything ok, send token to client
    createSendToken(admin, 200, res);
  }
);

// @desc    Logout admin
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // FIXED: Use same cookie options for logout
    const cookieOptions = {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: config.nodeEnv === 'production' ? 'none' as const : 'lax' as const,
      domain: config.nodeEnv === 'production' ? '.padmasambhavatrip.com' : undefined,
    };

    res.cookie('jwt', 'loggedout', cookieOptions);

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  }
);

// @desc    Get current admin
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?._id;
    
    if (!userId) {
      return next(new AppError('User not found in request', 401));
    }

    const admin = await Admin.findById(userId);

    res.status(200).json({
      status: 'success',
      data: {
        admin,
      },
    });
  }
);

// @desc    Protect routes - verify JWT token
export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get token from header or cookie
    let token: string | undefined;
    
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    console.log('🔐 Protect middleware:');
    console.log('   Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
    console.log('   Cookie jwt:', req.cookies?.jwt ? 'Present' : 'Missing');
    console.log('   Token extracted:', token ? 'Yes' : 'No');

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }

    // 2) Verify token
    let decoded: IJWTPayload;
    try {
      decoded = jwt.verify(token, config.jwtSecret as string) as IJWTPayload;
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      return next(new AppError('Invalid token. Please log in again.', 401));
    }

    // 3) Check if admin still exists
    const currentAdmin = await Admin.findById(decoded.id);
    
    if (!currentAdmin) {
      return next(
        new AppError('The admin belonging to this token no longer exists.', 401)
      );
    }

    // 4) Check if admin is active
    if (!currentAdmin.isActive) {
      return next(new AppError('Your account has been deactivated', 403));
    }

    console.log('✅ Authentication successful for:', currentAdmin.email);

    // Grant access to protected route
    (req as any).user = currentAdmin;
    next();
  }
);