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

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/trips', tripRoutes);

// More routes can be added here:
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