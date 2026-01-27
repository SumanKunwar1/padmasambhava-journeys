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

// Import routes (will be created later)
// import authRoutes from './routes/authRoutes';
// import tripRoutes from './routes/tripRoutes';
// import blogRoutes from './routes/blogRoutes';
// import userRoutes from './routes/userRoutes';
// import bookingRoutes from './routes/bookingRoutes';
// import applicationRoutes from './routes/applicationRoutes';

const app: Application = express();

// CORS configuration
const corsOptions = {
  origin: config.clientUrl,
  credentials: true,
  optionsSuccessStatus: 200,
};

// Global Middleware
app.use(cors(corsOptions));
app.use(helmet()); // Security headers
app.use(express.json({ limit: '10mb' })); // Body parser
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser()); // Cookie parser
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
app.use(compression()); // Compress responses

// Request logging middleware (development)
if (config.nodeEnv === 'development') {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
  });
});

// API Routes (uncomment when routes are created)
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/trips', tripRoutes);
// app.use('/api/v1/blogs', blogRoutes);
// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/bookings', bookingRoutes);
// app.use('/api/v1/applications', applicationRoutes);

// Handle undefined routes
app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorHandler);

export default app;