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
import CategoryModel from './models/categoryModel';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/categories', authenticate, categoryRoutes);
app.use('/posts', authenticate, postRoutes);
app.use('/comments', authenticate, commentRoutes);
app.use('/tags', authenticate, tagRoutes);

// 1. Kök dizin için route ekleyin
app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Blog API is running' });
});

// 2. Static dosyaları servis etme (React/Vue/Angular kullanıyorsanız)
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