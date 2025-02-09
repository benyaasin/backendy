import express from 'express';
import dotenv from 'dotenv';
import categoryRoutes from './routes/categoryRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import tagRoutes from './routes/tagRoutes';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import CategoryModel from './models/categoryModel';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/categories', categoryRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/tags', tagRoutes);

// 1. Kök dizin için route ekleyin
app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Blog API is running' });
});

// 2. Static dosyaları servis etme (React/Vue/Angular kullanıyorsanız)
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Hata:', err);
  res.status(500).json({
    message: 'Sunucuda bir hata oluştu',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: 'Endpoint bulunamadı',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor 🚀`);
});

export default app; 