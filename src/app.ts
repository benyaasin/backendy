import express from 'express';
import dotenv from 'dotenv';
import categoryRoutes from './routes/categoryRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
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

// 1. Kök dizin için route ekleyin
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// 2. Static dosyaları servis etme (React/Vue/Angular kullanıyorsanız)
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Hata Detayları:', err);
  res.status(500).json({
    message: 'Sunucuda bir hata oluştu',
    error: err.message,
    stack: err.stack
  });
});

// 3. 404 handler ekleyin
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start server
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor 🚀`);
});

export default app; 