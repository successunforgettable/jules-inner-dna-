import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db';
import authRoutes from './api/routes/authRoutes';
import contentRoutes from './api/routes/contentRoutes';
import assessmentRoutes from './api/routes/assessmentRoutes'; // Import assessment routes

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

connectDB();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', message: 'Server is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/assessment', assessmentRoutes); // Mount assessment routes

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

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  console.log(`[server]: CORS enabled for origin: ${process.env.CLIENT_ORIGIN || 'http://localhost:3000'}`);
  if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    console.warn('[server]: WARNING - JWT_SECRET or REFRESH_TOKEN_SECRET is not defined. Authentication will fail.');
  }
  if (!process.env.MONGODB_URI) {
    console.warn('[server]: WARNING - MONGODB_URI is not defined. Database connection will fail if not using in-memory mode for other parts.');
  }
});

export default app;
```
