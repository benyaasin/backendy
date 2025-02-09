import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import categoryRoutes from './routes/categoryRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import tagRoutes from './routes/tagRoutes';
import authRoutes from './routes/authRoutes';
import { authenticate } from './middleware/auth';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // React uygulamasının adresi
  credentials: true
}));
app.use(express.json());

// Public Routes (Kimlik doğrulaması gerektirmeyen)
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/categories', categoryRoutes);

// Protected Routes (Kimlik doğrulaması gerektiren)
app.use('/auth', authRoutes);
app.use('/tags', authenticate, tagRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Blog API is running' });
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: 'Endpoint not found',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});

export default app; 