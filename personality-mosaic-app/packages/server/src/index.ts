import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db'; // Import connectDB
import authRoutes from './api/routes/authRoutes';
// import assessmentRoutes from './api/routes/assessmentRoutes'; // Placeholder for future
// import reportRoutes from './api/routes/reportRoutes';       // Placeholder for future

// Load environment variables from .env file
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// --- Connect to Database ---
connectDB(); // Call connectDB to establish MongoDB connection

// --- Core Middleware ---
// Enable CORS - configure origins properly for production
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));
// Set various HTTP headers for security
app.use(helmet());
// Middleware to parse JSON request bodies
app.use(express.json());
// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));


// --- API Routes ---
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', message: 'Server is running!' });
});

app.use('/api/auth', authRoutes);
// app.use('/api/assessment', assessmentRoutes); // Mount when ready
// app.use('/api/reports', reportRoutes);       // Mount when ready


// --- Global Error Handling Middleware ---
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err.stack || err.message);
  const statusCode = res.statusCode && res.statusCode >= 400 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'An unexpected error occurred'
      : err.message || 'Internal Server Error',
  });
});

// --- Unknown Route Handler ---
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Sorry, can't find that!" });
});


// --- Server Activation ---
// Server is started only if DB connection is successful (implied by connectDB not exiting process on its own for this example)
// In connectDB, process.exit(1) is called on connection failure, so this won't run if DB fails.
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  console.log(`[server]: CORS enabled for origin: ${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}`);
  if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    console.warn('[server]: WARNING - JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in .env. Authentication will fail.');
  }
  if (!process.env.MONGODB_URI) {
    console.warn('[server]: WARNING - MONGODB_URI is not defined. Database connection will fail.');
  }
});
