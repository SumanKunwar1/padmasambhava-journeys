// app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/appError';

// Import routes
import authRoutes from './routes/auth.routes';
import tripRoutes from './routes/trip.routes';
import visaApplicationRoutes from './routes/visaApplication.routes';
import documentationRoutes from './routes/documentation.routes';
import customTripRoutes from './routes/customTrip.routes';
import bookingRoutes from './routes/booking.routes';
import heroImageRoutes from './routes/heroImage.routes';
import exploreDestinationRoutes from './routes/exploreDestination.routes';
import trendingDestinationRoutes from './routes/trendingDestination.routes';
import insuranceRoutes from './routes/insurance.routes';
import agentRoutes from './routes/agent.routes';
import testimonialRoutes from './routes/testimonial.routes';

const app: Application = express();

// ========== CORS CONFIGURATION - CRITICAL FOR PRODUCTION ==========
console.log(`🔧 Setting up CORS for CLIENT_URL: ${config.clientUrl}`);
console.log(`🔧 Node Environment: ${config.nodeEnv}`);

// FIXED: Production-ready CORS configuration
const allowedOrigins = [
  config.clientUrl,
  'https://padmasambhavatrip.com',
  'https://www.padmasambhavatrip.com',
  // Add any other subdomains you might use
];

// In development, also allow localhost
if (config.nodeEnv === 'development') {
  allowedOrigins.push('http://localhost:8080');
  allowedOrigins.push('http://localhost:5173');
  allowedOrigins.push('http://localhost:3000');
}

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`⚠️  Blocked CORS request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // CRITICAL: Allow cookies and credentials
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Content-Type-Options'],
  optionsSuccessStatus: 200,
  maxAge: 86400, // 24 hours - cache preflight requests
};

// Apply CORS middleware FIRST
app.use(cors(corsOptions));

// ========== SECURITY & COMPRESSION MIDDLEWARE ==========
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resources
}));

// IMPORTANT: Cookie parser must come BEFORE routes
app.use(cookieParser());

app.use(express.json({ limit: '50mb' })); // Body parser - increased for file uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
app.use(compression()); // Compress responses

// ========== TRUST PROXY (CRITICAL FOR PRODUCTION) ==========
// This is essential when running behind a reverse proxy (like Nginx, Render, etc.)
app.set('trust proxy', 1);

// ========== ADDITIONAL CORS HEADERS (Fallback) ==========
app.use((req: Request, res: Response, next: NextFunction): void => {
  const origin = req.headers.origin as string;
  
  // Check if origin is in allowed list
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Expose-Headers', 'Content-Length, X-Content-Type-Options');
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// ========== REQUEST LOGGING MIDDLEWARE ==========
app.use((req: Request, _res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  console.log(`   Origin: ${req.headers.origin || 'none'}`);
  console.log(`   Authorization: ${req.headers.authorization ? 'Present' : 'None'}`);
  console.log(`   Cookies: ${req.cookies ? Object.keys(req.cookies).join(', ') : 'None'}`);
  
  // Log request body for debugging (without sensitive data)
  if ((req.method === 'POST' || req.method === 'PATCH') && req.body) {
    const logBody = { ...req.body };
    // Remove sensitive fields
    if (logBody.password) delete logBody.password;
    if (logBody.token) delete logBody.token;
    if (logBody.jwt) delete logBody.jwt;
    
    if (Object.keys(logBody).length > 0) {
      console.log(`📦 Body:`, logBody);
    }
  }
  next();
});

// ========== HEALTH CHECK ROUTE ==========
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    nodeEnv: config.nodeEnv,
    clientUrl: config.clientUrl,
    allowedOrigins: allowedOrigins,
  });
});

// ========== API ROUTES ==========
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/trips', tripRoutes);
app.use('/api/v1/visa-applications', visaApplicationRoutes);
app.use('/api/v1/documentation', documentationRoutes);
app.use('/api/v1/custom-trips', customTripRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/hero-images', heroImageRoutes);
app.use('/api/v1/explore-destinations', exploreDestinationRoutes);
app.use('/api/v1/trending-destinations', trendingDestinationRoutes);
app.use('/api/v1/insurance', insuranceRoutes);
app.use('/api/v1/agents', agentRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);

// ========== 404 HANDLER ==========
app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ========== GLOBAL ERROR HANDLER ==========
app.use(errorHandler);

export default app;